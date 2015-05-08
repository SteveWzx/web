// Backbone.js 0.9.2

// (c) 2010-2012 Jeremy Ashkenas, DocumentCloud Inc.
// Backbone may be freely distributed under the MIT license.
// For all details and documentation:
// http://backbonejs.org
(function() {

    // 创建一个全局对象, 在浏览器中表示为window对象, 在Node.js中表示global对象
    var root = this;

    // 保存"Backbone"变量被覆盖之前的值
    // 如果出现命名冲突或考虑到规范, 可通过Backbone.noConflict()方法恢复该变量被Backbone占用之前的值, 并返回Backbone对象以便重新命名
    var previousBackbone = root.Backbone;

    // 将Array.prototype中的slice和splice方法缓存到局部变量以供调用
    var slice = Array.prototype.slice;
    var splice = Array.prototype.splice;

    var Backbone;
    if( typeof exports !== 'undefined') {
        Backbone = exports;
    } else {
        Backbone = root.Backbone = {};
    }

    // 定义Backbone版本
    Backbone.VERSION = '0.9.2';

    // 在服务器环境下自动导入Underscore, 在Backbone中部分方法依赖或继承自Underscore
    var _ = root._;
    if(!_ && ( typeof require !== 'undefined'))
        _ = require('underscore');

    // 定义第三方库为统一的变量"$", 用于在视图(View), 事件处理和与服务器数据同步(sync)时调用库中的方法
    // 支持的库包括jQuery, Zepto等, 它们语法相同, 但Zepto更适用移动开发, 它主要针对Webkit内核浏览器
    // 也可以通过自定义一个与jQuery语法相似的自定义库, 供Backbone使用(有时我们可能需要一个比jQuery, Zepto更轻巧的自定义版本)
    // 这里定义的"$"是局部变量, 因此不会影响在Backbone框架之外第三方库的正常使用
    var $ = root.jQuery || root.Zepto || root.ender;

    // 手动设置第三方库
    // 如果在导入了Backbone之前并没有导入第三方库, 可以通过setDomLibrary方法设置"$"局部变量
    // setDomLibrary方法也常用于在Backbone中动态导入自定义库
    Backbone.setDomLibrary = function(lib) {
        $ = lib;
    };
    // 放弃以"Backbone"命名框架, 并返回Backbone对象, 一般用于避免命名冲突或规范命名方式
    // 例如:
    // var bk = Backbone.noConflict(); // 取消"Backbone"命名, 并将Backbone对象存放于bk变量中
    // console.log(Backbone); // 该变量已经无法再访问Backbone对象, 而恢复为Backbone定义前的值
    // var MyBackbone = bk; // 而bk存储了Backbone对象, 我们将它重命名为MyBackbone
    Backbone.noConflict = function() {
        root.Backbone = previousBackbone;
        return this;
    };
    // 对于不支持REST方式的浏览器, 可以设置Backbone.emulateHTTP = true
    // 与服务器请求将以POST方式发送, 并在数据中加入_method参数标识操作名称, 同时也将发送X-HTTP-Method-Override头信息
    Backbone.emulateHTTP = false;

    // 对于不支持application/json编码的浏览器, 可以设置Backbone.emulateJSON = true;
    // 将请求类型设置为application/x-www-form-urlencoded, 并将数据放置在model参数中实现兼容
    Backbone.emulateJSON = false;

    // Backbone.Events 自定义事件相关
    // -----------------

    // eventSplitter指定处理多个事件时, 事件名称的解析规则
    var eventSplitter = /\s+/;

    // 自定义事件管理器
    // 通过在对象中绑定Events相关方法, 允许向对象添加, 删除和触发自定义事件
    var Events = Backbone.Events = {

        // 将自定义事件(events)和回调函数(callback)绑定到当前对象
        // 回调函数中的上下文对象为指定的context, 如果没有设置context则上下文对象默认为当前绑定事件的对象
        // 该方法类似与DOM Level2中的addEventListener方法
        // events允许指定多个事件名称, 通过空白字符进行分隔(如空格, 制表符等)
        // 当事件名称为"all"时, 在调用trigger方法触发任何事件时, 均会调用"all"事件中绑定的所有回调函数
        on : function(events, callback, context) {
            // 定义一些函数中使用到的局部变量
            var calls, event, node, tail, list;
            // 必须设置callback回调函数
            if(!callback)
                return this;
            // 通过eventSplitter对事件名称进行解析, 使用split将多个事件名拆分为一个数组
            // 一般使用空白字符指定多个事件名称
            events = events.split(eventSplitter);
            // calls记录了当前对象中已绑定的事件与回调函数列表
            calls = this._callbacks || (this._callbacks = {});

            // 循环事件名列表, 从头至尾依次将事件名存放至event变量
            while( event = events.shift()) {
                // 获取已经绑定event事件的回调函数
                // list存储单个事件名中绑定的callback回调函数列表
                // 函数列表并没有通过数组方式存储, 而是通过多个对象的next属性进行依次关联
                /** 数据格式如:
                 * {
                 *     tail: {Object},
                 *     next: {
                 *         callback: {Function},
                 *         context: {Object},
                 *         next: {
                 *             callback: {Function},
                 *             context: {Object},
                 *             next: {Object}
                 *         }
                 *     }
                 * }
                 */
                // 列表每一层next对象存储了一次回调事件相关信息(函数体, 上下文和下一次回调事件)
                // 事件列表最顶层存储了一个tail对象, 它存储了最后一次绑定回调事件的标识(与最后一次回调事件的next指向同一个对象)
                // 通过tail标识, 可以在遍历回调列表时得知已经到达最后一个回调函数
                list = calls[event];
                // node变量用于记录本次回调函数的相关信息
                // tail只存储最后一次绑定回调函数的标识
                // 因此如果之前已经绑定过回调函数, 则将之前的tail指定给node作为一个对象使用, 然后创建一个新的对象标识给tail
                // 这里之所以要将本次回调事件添加到上一次回调的tail对象, 是为了让回调函数列表的对象层次关系按照绑定顺序排列(最新绑定的事件将被放到最底层)
                node = list ? list.tail : {};
                node.next = tail = {};
                // 记录本次回调的函数体及上下文信息
                node.context = context;
                node.callback = callback;
                // 重新组装当前事件的回调列表, 列表中已经加入了本次回调事件
                calls[event] = {
                    tail : tail,
                    next : list ? list.next : node
                };
            }
            // 返回当前对象, 方便进行方法链调用
            return this;
        },
        // 移除对象中已绑定的事件或回调函数, 可以通过events, callback和context对需要删除的事件或回调函数进行过滤
        // - 如果context为空, 则移除所有的callback指定的函数
        // - 如果callback为空, 则移除事件中所有的回调函数
        // - 如果events为空, 但指定了callback或context, 则移除callback或context指定的回调函数(不区分事件名称)
        // - 如果没有传递任何参数, 则移除对象中绑定的所有事件和回调函数
        off : function(events, callback, context) {
            var event, calls, node, tail, cb, ctx;

            // No events, or removing *all* events.
            // 当前对象没有绑定任何事件
            if(!( calls = this._callbacks))
                return;
            // 如果没有指定任何参数, 则移除所有事件和回调函数(删除_callbacks属性)
            if(!(events || callback || context)) {
                delete this._callbacks;
                return this;
            }

            // 解析需要移除的事件列表
            // - 如果指定了events, 则按照eventSplitter对事件名进行解析
            // - 如果没有指定events, 则解析已绑定所有事件的名称列表
            events = events ? events.split(eventSplitter) : _.keys(calls);

            // 循环事件名列表
            while( event = events.shift()) {
                // 将当前事件对象从列表中移除, 并缓存到node变量中
                node = calls[event];
                delete calls[event];
                // 如果不存在当前事件对象(或没有指定移除过滤条件, 则认为将移除当前事件及所有回调函数), 则终止此次操作(事件对象在上一步已经移除)
                if(!node || !(callback || context))
                    continue;
                // Create a new list, omitting the indicated callbacks.
                // 根据回调函数或上下文过滤条件, 组装一个新的事件对象并重新绑定
                tail = node.tail;
                // 遍历事件中的所有回调对象
                while(( node = node.next) !== tail) {
                    cb = node.callback;
                    ctx = node.context;
                    // 根据参数中的回调函数和上下文, 对回调函数进行过滤, 将不符合过滤条件的回调函数重新绑定到事件中(因为事件中的所有回调函数在上面已经被移除)
                    if((callback && cb !== callback) || (context && ctx !== context)) {
                        this.on(event, cb, ctx);
                    }
                }
            }

            return this;
        },
        // 触发已经定义的一个或多个事件, 依次执行绑定的回调函数列表
        trigger : function(events) {
            var event, node, calls, tail, args, all, rest;
            // 当前对象没有绑定任何事件
            if(!( calls = this._callbacks))
                return this;
            // 获取回调函数列表中绑定的"all"事件列表
            all = calls.all;
            // 将需要触发的事件名称, 按照eventSplitter规则解析为一个数组
            events = events.split(eventSplitter);
            // 将trigger从第2个之后的参数, 记录到rest变量, 将依次传递给回调函数
            rest = slice.call(arguments, 1);

            // 循环需要触发的事件列表
            while( event = events.shift()) {
                // 此处的node变量记录了当前事件的所有回调函数列表
                if( node = calls[event]) {
                    // tail变量记录最后一次绑定事件的对象标识
                    tail = node.tail;
                    // node变量的值, 按照事件的绑定顺序, 被依次赋值为绑定的单个回调事件对象
                    // 最后一次绑定的事件next属性, 与tail引用同一个对象, 以此作为是否到达列表末尾的判断依据
                    while(( node = node.next) !== tail) {
                        // 执行所有绑定的事件, 并将调用trigger时的参数传递给回调函数
                        node.callback.apply(node.context || this, rest);
                    }
                }
                // 变量all记录了绑定时的"all"事件, 即在调用任何事件时, "all"事件中的回调函数均会被执行
                // - "all"事件中的回调函数无论绑定顺序如何, 都会在当前事件的回调函数列表全部执行完毕后再依次执行
                // - "all"事件应该在触发普通事件时被自动调用, 如果强制触发"all"事件, 事件中的回调函数将被执行两次
                if( node = all) {
                    tail = node.tail;
                    // 与调用普通事件的回调函数不同之处在于, all事件会将当前调用的事件名作为第一个参数传递给回调函数
                    args = [event].concat(rest);
                    // 遍历并执行"all"事件中的回调函数列表
                    while(( node = node.next) !== tail) {
                        node.callback.apply(node.context || this, args);
                    }
                }
            }

            return this;
        }
    };

    // 绑定事件与释放事件的别名, 也为了同时兼容Backbone以前的版本
    Events.bind = Events.on;
    Events.unbind = Events.off;

    // Backbone.Model 数据对象模型
    // --------------

    // Model是Backbone中所有数据对象模型的基类, 用于创建一个数据模型
    // @param {Object} attributes 指定创建模型时的初始化数据
    // @param {Object} options
    /**
     * @format options
     * {
     *     parse: {Boolean},
     *     collection: {Collection}
     * }
     */
    var Model = Backbone.Model = function(attributes, options) {
        // defaults变量用于存储模型的默认数据
        var defaults;
        // 如果没有指定attributes参数, 则设置attributes为空对象
        attributes || ( attributes = {});
        // 设置attributes默认数据的解析方法, 例如默认数据是从服务器获取(或原始数据是XML格式), 为了兼容set方法所需的数据格式, 可使用parse方法进行解析
        if(options && options.parse)
            attributes = this.parse(attributes);
        if( defaults = getValue(this, 'defaults')) {
            // 如果Model在定义时设置了defaults默认数据, 则初始化数据使用defaults与attributes参数合并后的数据(attributes中的数据会覆盖defaults中的同名数据)
            attributes = _.extend({}, defaults, attributes);
        }
        // 显式指定模型所属的Collection对象(在调用Collection的add, push等将模型添加到集合中的方法时, 会自动设置模型所属的Collection对象)
        if(options && options.collection)
            this.collection = options.collection;
        // attributes属性存储了当前模型的JSON对象化数据, 创建模型时默认为空
        this.attributes = {};
        // 定义_escapedAttributes缓存对象, 它将缓存通过escape方法处理过的数据
        this._escapedAttributes = {};
        // 为每一个模型配置一个唯一标识
        this.cid = _.uniqueId('c');
        // 定义一系列用于记录数据状态的对象, 具体含义请参考对象定义时的注释
        this.changed = {};
        this._silent = {};
        this._pending = {};
        // 创建实例时设置初始化数据, 首次设置使用silent参数, 不会触发change事件
        this.set(attributes, {
            silent : true
        });
        // 上面已经设置了初始化数据, changed, _silent, _pending对象的状态可能已经发生变化, 这里重新进行初始化
        this.changed = {};
        this._silent = {};
        this._pending = {};
        // _previousAttributes变量存储模型数据的一个副本
        // 用于在change事件中获取模型数据被改变之前的状态, 可通过previous或previousAttributes方法获取上一个状态的数据
        this._previousAttributes = _.clone(this.attributes);
        // 调用initialize初始化方法
        this.initialize.apply(this, arguments);
    };
    // 使用extend方法为Model原型定义一系列属性和方法
    _.extend(Model.prototype, Events, {

        // changed属性记录了每次调用set方法时, 被改变数据的key集合
        changed : null,

        // // 当指定silent属性时, 不会触发change事件, 被改变的数据会记录下来, 直到下一次触发change事件
        // _silent属性用来记录使用silent时的被改变的数据
        _silent : null,

        _pending : null,

        // 每个模型的唯一标识属性(默认为"id", 通过修改idAttribute可自定义id属性名)
        // 如果在设置数据时包含了id属性, 则id将会覆盖模型的id
        // id用于在Collection集合中查找和标识模型, 与后台接口通信时也会以id作为一条记录的标识
        idAttribute : 'id',

        // 模型初始化方法, 在模型被构造结束后自动调用
        initialize : function() {
        },
        // 返回当前模型中数据的一个副本(JSON对象格式)
        toJSON : function(options) {
            return _.clone(this.attributes);
        },
        // 根据attr属性名, 获取模型中的数据值
        get : function(attr) {
            return this.attributes[attr];
        },
        // 根据attr属性名, 获取模型中的数据值, 数据值包含的HTML特殊字符将被转换为HTML实体, 包含 & < > " ' \
        // 通过 _.escape方法实现
        escape : function(attr) {
            var html;
            // 从_escapedAttributes缓存对象中查找数据, 如果数据已经被缓存则直接返回
            if( html = this._escapedAttributes[attr])
                return html;
            // _escapedAttributes缓存对象中没有找到数据
            // 则先从模型中获取数据
            var val = this.get(attr);
            // 将数据中的HTML使用 _.escape方法转换为实体, 并缓存到_escapedAttributes对象, 便于下次直接获取
            return this._escapedAttributes[attr] = _.escape(val == null ? '' : '' + val);
        },
        // 检查模型中是否存在某个属性, 当该属性的值被转换为Boolean类型后值为false, 则认为不存在
        // 如果值为false, null, undefined, 0, NaN, 或空字符串时, 均会被转换为false
        has : function(attr) {
            return this.get(attr) != null;
        },
        // 设置模型中的数据, 如果key值不存在, 则作为新的属性添加到模型, 如果key值已经存在, 则修改为新的值
        set : function(key, value, options) {
            // attrs变量中记录需要设置的数据对象
            var attrs, attr, val;

            // 参数形式允许key-value对象形式, 或通过key, value两个参数进行单独设置
            // 如果key是一个对象, 则认定为使用对象形式设置, 第二个参数将被视为options参数
            if(_.isObject(key) || key == null) {
                attrs = key;
                options = value;
            } else {
                // 通过key, value两个参数单独设置, 将数据放到attrs对象中方便统一处理
                attrs = {};
                attrs[key] = value;
            }

            // options配置项必须是一个对象, 如果没有设置options则默认值为一个空对象
            options || ( options = {});
            // 没有设置参数时不执行任何动作
            if(!attrs)
                return this;
            // 如果被设置的数据对象属于Model类的一个实例, 则将Model对象的attributes数据对象赋给attrs
            // 一般在复制一个Model对象的数据到另一个Model对象时, 会执行该动作
            if( attrs instanceof Model)
                attrs = attrs.attributes;
            // 如果options配置对象中设置了unset属性, 则将attrs数据对象中的所有属性重置为undefined
            // 一般在复制一个Model对象的数据到另一个Model对象时, 但仅仅需要复制Model中的数据而不需要复制值时执行该操作
            if(options.unset)
                for(attr in attrs)
                attrs[attr] =
                void 0;

            // 对当前数据进行验证, 如果验证未通过则停止执行
            if(!this._validate(attrs, options))
                return false;

            // 如果设置的id属性名被包含在数据集合中, 则将id覆盖到模型的id属性
            // 这是为了确保在自定义id属性名后, 访问模型的id属性时, 也能正确访问到id
            if(this.idAttribute in attrs)
                this.id = attrs[this.idAttribute];

            var changes = options.changes = {};
            // now记录当前模型中的数据对象
            var now = this.attributes;
            // escaped记录当前模型中通过escape缓存过的数据
            var escaped = this._escapedAttributes;
            // prev记录模型中数据被改变之前的值
            var prev = this._previousAttributes || {};

            // 遍历需要设置的数据对象
            for(attr in attrs) {
                // attr存储当前属性名称, val存储当前属性的值
                val = attrs[attr];

                // 如果当前数据在模型中不存在, 或已经发生变化, 或在options中指定了unset属性删除, 则删除该数据被换存在_escapedAttributes中的数据
                if(!_.isEqual(now[attr], val) || (options.unset && _.has(now, attr))) {
                    // 仅删除通过escape缓存过的数据, 这是为了保证缓存中的数据与模型中的真实数据保持同步
                    delete escaped[attr];
                    // 如果指定了silent属性, 则此次set方法调用不会触发change事件, 因此将被改变的数据记录到_silent属性中, 便于下一次触发change事件时, 通知事件监听函数此数据已经改变
                    // 如果没有指定silent属性, 则直接设置changes属性中当前数据为已改变状态
                    (options.silent ? this._silent : changes)[attr] = true;
                }

                // 如果在options中设置了unset, 则从模型中删除该数据(包括key)
                // 如果没有指定unset属性, 则认为将新增或修改数据, 向模型的数据对象中加入新的数据
                options.unset ?
                delete now[attr] : now[attr] = val;

                // 如果模型中的数据与新的数据不一致, 则表示该数据已发生变化
                if(!_.isEqual(prev[attr], val) || (_.has(now, attr) != _.has(prev, attr))) {
                    // 在changed属性中记录当前属性已经发生变化的状态
                    this.changed[attr] = val;
                    if(!options.silent)
                        this._pending[attr] = true;
                } else {
                    // 如果数据没有发生变化, 则从changed属性中移除已变化状态
                    delete this.changed[attr];
                    delete this._pending[attr];
                }
            }

            // 调用change方法, 将触发change事件绑定的函数
            if(!options.silent)
                this.change(options);
            return this;
        },
        // 从当前模型中删除指定的数据(属性也将被同时删除)
        unset : function(attr, options) {
            (options || ( options = {})).unset = true;
            // 通过options.unset配置项告知set方法进行删除操作
            return this.set(attr, null, options);
        },
        // 清除当前模型中的所有数据和属性
        clear : function(options) {
            (options || ( options = {})).unset = true;
            // 克隆一个当前模型的属性副本, 并通过options.unset配置项告知set方法执行删除操作
            return this.set(_.clone(this.attributes), options);
        },
        // 从服务器获取默认的模型数据, 获取数据后使用set方法将数据填充到模型, 因此如果获取到的数据与当前模型中的数据不一致, 将会触发change事件
        fetch : function(options) {
            // 确保options是一个新的对象, 随后将改变options中的属性
            options = options ? _.clone(options) : {};
            var model = this;
            // 在options中可以指定获取数据成功后的自定义回调函数
            var success = options.success;
            // 当获取数据成功后填充数据并调用自定义成功回调函数
            options.success = function(resp, status, xhr) {
                // 通过parse方法将服务器返回的数据进行转换
                // 通过set方法将转换后的数据填充到模型中, 因此可能会触发change事件(当数据发生变化时)
                // 如果填充数据时验证失败, 则不会调用自定义success回调函数
                if(!model.set(model.parse(resp, xhr), options))
                    return false;
                // 调用自定义的success回调函数
                if(success)
                    success(model, resp);
            };
            // 请求发生错误时通过wrapError处理error事件
            options.error = Backbone.wrapError(options.error, model, options);
            // 调用sync方法从服务器获取数据
            return (this.sync || Backbone.sync).call(this, 'read', this, options);
        },
        // 保存模型中的数据到服务器
        save : function(key, value, options) {
            // attrs存储需要保存到服务器的数据对象
            var attrs, current;

            // 支持设置单个属性的方式 key: value
            // 支持对象形式的批量设置方式 {key: value}
            if(_.isObject(key) || key == null) {
                // 如果key是一个对象, 则认为是通过对象方式设置
                // 此时第二个参数被认为是options
                attrs = key;
                options = value;
            } else {
                // 如果是通过key: value形式设置单个属性, 则直接设置attrs
                attrs = {};
                attrs[key] = value;
            }
            // 配置对象必须是一个新的对象
            options = options ? _.clone(options) : {};

            // 如果在options中设置了wait选项, 则被改变的数据将会被提前验证, 且服务器没有响应新数据(或响应失败)时, 本地数据会被还原为修改前的状态
            // 如果没有设置wait选项, 则无论服务器是否设置成功, 本地数据均会被修改为最新状态
            if(options.wait) {
                // 对需要保存的数据提前进行验证
                if(!this._validate(attrs, options))
                    return false;
                // 记录当前模型中的数据, 用于在将数据发送到服务器后, 将数据进行还原
                // 如果服务器响应失败或没有返回数据, 则可以保持修改前的状态
                current = _.clone(this.attributes);
            }

            // silentOptions在options对象中加入了silent(不对数据进行验证)
            // 当使用wait参数时使用silentOptions配置项, 因为在上面已经对数据进行过验证
            // 如果没有设置wait参数, 则仍然使用原始的options配置项
            var silentOptions = _.extend({}, options, {
                silent : true
            });
            // 将修改过最新的数据保存到模型中, 便于在sync方法中获取模型数据保存到服务器
            if(attrs && !this.set(attrs, options.wait ? silentOptions : options)) {
                return false;
            }

            var model = this;
            // 在options中可以指定保存数据成功后的自定义回调函数
            var success = options.success;
            // 服务器响应成功后执行success
            options.success = function(resp, status, xhr) {
                // 获取服务器响应最新状态的数据
                var serverAttrs = model.parse(resp, xhr);
                // 如果使用了wait参数, 则优先将修改后的数据状态直接设置到模型
                if(options.wait) {
                    delete options.wait;
                    serverAttrs = _.extend(attrs || {}, serverAttrs);
                }
                // 将最新的数据状态设置到模型中
                // 如果调用set方法时验证失败, 则不会调用自定义的success回调函数
                if(!model.set(serverAttrs, options))
                    return false;
                if(success) {
                    // 调用响应成功后自定义的success回调函数
                    success(model, resp);
                } else {
                    // 如果没有指定自定义回调, 则默认触发sync事件
                    model.trigger('sync', model, resp, options);
                }
            };
            // 请求发生错误时通过wrapError处理error事件
            options.error = Backbone.wrapError(options.error, model, options);
            // 将模型中的数据保存到服务器
            // 如果当前模型是一个新建的模型(没有id), 则使用create方法(新增), 否则认为是update方法(修改)
            var method = this.isNew() ? 'create' : 'update';
            var xhr = (this.sync || Backbone.sync).call(this, method, this, options);
            // 如果设置了options.wait, 则将数据还原为修改前的状态
            // 此时保存的请求还没有得到响应, 因此如果响应失败, 模型中将保持修改前的状态, 如果服务器响应成功, 则会在success中设置模型中的数据为最新状态
            if(options.wait)
                this.set(current, silentOptions);
            return xhr;
        },
        // 删除模型, 模型将同时从所属的Collection集合中被删除
        // 如果模型是在客户端新建的, 则直接从客户端删除
        // 如果模型数据同时存在服务器, 则同时会删除服务器端的数据
        destroy : function(options) {
            // 配置项必须是一个新的对象
            options = options ? _.clone(options) : {};
            var model = this;
            // 在options中可以指定删除数据成功后的自定义回调函数
            var success = options.success;
            // 删除数据成功调用, 触发destroy事件, 如果模型存在于Collection集合中, 集合将监听destroy事件并在触发时从集合中移除该模型
            // 删除模型时, 模型中的数据并没有被清空, 但模型已经从集合中移除, 因此当没有任何地方引用该模型时, 会被自动从内存中释放
            // 建议在删除模型时, 将模型对象的引用变量设置为null
            var triggerDestroy = function() {
                model.trigger('destroy', model, model.collection, options);
            };
            // 如果该模型是一个客户端新建的模型, 则直接调用triggerDestroy从集合中将模型移除
            if(this.isNew()) {
                triggerDestroy();
                return false;
            }

            // 当从服务器删除数据成功时
            options.success = function(resp) {
                // 如果在options对象中配置wait项, 则表示本地内存中的模型数据, 会在服务器数据被删除成功后再删除
                // 如果服务器响应失败, 则本地数据不会被删除
                if(options.wait)
                    triggerDestroy();
                if(success) {
                    // 调用自定义的成功回调函数
                    success(model, resp);
                } else {
                    // 如果没有自定义回调, 则默认触发sync事件
                    model.trigger('sync', model, resp, options);
                }
            };
            // 请求发生错误时通过wrapError处理error事件
            options.error = Backbone.wrapError(options.error, model, options);
            // 通过sync方法发送删除数据的请求
            var xhr = (this.sync || Backbone.sync).call(this, 'delete', this, options);
            // 如果没有在options对象中配置wait项, 则会先删除本地数据, 再发送请求删除服务器数据
            // 此时无论服务器删除是否成功, 本地模型数据已被删除
            if(!options.wait)
                triggerDestroy();
            return xhr;
        },
        // 获取模型在服务器接口中对应的url, 在调用save, fetch, destroy等与服务器交互的方法时, 将使用该方法获取url
        // 生成的url类似于"PATHINFO"模式, 服务器对模型的操作只有一个url, 对于修改和删除操作会在url后追加模型id便于标识
        // 如果在模型中定义了urlRoot, 服务器接口应为[urlRoot/id]形式
        // 如果模型所属的Collection集合定义了url方法或属性, 则使用集合中的url形式: [collection.url/id]
        // 在访问服务器url时会在url后面追加上模型的id, 便于服务器标识一条记录, 因此模型中的id需要与服务器记录对应
        // 如果无法获取模型或集合的url, 将调用urlError方法抛出一个异常
        // 如果服务器接口并没有按照"PATHINFO"方式进行组织, 可以通过重载url方法实现与服务器的无缝交互
        url : function() {
            // 定义服务器对应的url路径
            var base = getValue(this, 'urlRoot') || getValue(this.collection, 'url') || urlError();
            // 如果当前模型是客户端新建的模型, 则不存在id属性, 服务器url直接使用base
            if(this.isNew())
                return base;
            // 如果当前模型具有id属性, 可能是调用了save或destroy方法, 将在base后面追加模型的id
            // 下面将判断base最后一个字符是否是"/", 生成的url格式为[base/id]
            return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + encodeURIComponent(this.id);
        },
        // parse方法用于解析从服务器获取的数据, 返回一个能够被set方法解析的模型数据
        // 一般parse方法会根据服务器返回的数据进行重载, 以便构建与服务器的无缝连接
        // 当服务器返回的数据结构与set方法所需的数据结构不一致(例如服务器返回XML格式数据时), 可使用parse方法进行转换
        parse : function(resp, xhr) {
            return resp;
        },
        // 创建一个新的模型, 它具有和当前模型相同的数据
        clone : function() {
            return new this.constructor(this.attributes);
        },
        // 检查当前模型是否是客户端创建的新模型
        // 检查方式是根据模型是否存在id标识, 客户端创建的新模型没有id标识
        // 因此服务器响应的模型数据中必须包含id标识, 标识的属性名默认为"id", 也可以通过修改idAttribute属性自定义标识
        isNew : function() {
            return this.id == null;
        },
        // 数据被更新时触发change事件绑定的函数
        // 当set方法被调用, 会自动调用change方法, 如果在set方法被调用时指定了silent配置, 则需要手动调用change方法
        change : function(options) {
            // options必须是一个对象
            options || ( options = {});
            // this._changing相关的逻辑有些问题
            // this._changing在方法最后被设置为false, 因此方法上面changing变量的值始终为false(第一次为undefined)
            // 作者的初衷应该是想用该变量标示change方法是否执行完毕, 对于浏览器端单线程的脚本来说没有意义, 因为该方法被执行时会阻塞其它脚本
            // changing获取上一次执行的状态, 如果上一次脚本没有执行完毕, 则值为true
            var changing = this._changing;
            // 开始执行标识, 执行过程中值始终为true, 执行完毕后this._changing被修改为false
            this._changing = true;

            // 将非本次改变的数据状态添加到_pending对象中
            for(var attr in this._silent)
            this._pending[attr] = true;

            // changes对象包含了当前数据上一次执行change事件至今, 已被改变的所有数据
            // 如果之前使用silent未触发change事件, 则本次会被放到changes对象中
            var changes = _.extend({}, options.changes, this._silent);
            // 重置_silent对象
            this._silent = {};
            // 遍历changes对象, 分别针对每一个属性触发单独的change事件
            for(var attr in changes) {
                // 将Model对象, 属性值, 配置项作为参数以此传递给事件的监听函数
                this.trigger('change:' + attr, this, this.get(attr), options);
            }

            // 如果方法处于执行中, 则停止执行
            if(changing)
                return this;

            // 触发change事件, 任意数据被改变后, 都会依次触发"change:属性"事件和"change"事件
            while(!_.isEmpty(this._pending)) {
                this._pending = {};
                // 触发change事件, 并将Model实例和配置项作为参数传递给监听函数
                this.trigger('change', this, options);
                // 遍历changed对象中的数据, 并依次将已改变数据的状态从changed中移除
                // 在此之后如果调用hasChanged检查数据状态, 将得到false(未改变)
                for(var attr in this.changed) {
                    if(this._pending[attr] || this._silent[attr])
                        continue;
                    // 移除changed中数据的状态
                    delete this.changed[attr];
                }
                // change事件执行完毕, _previousAttributes属性将记录当前模型最新的数据副本
                // 因此如果需要获取数据的上一个状态, 一般只通过在触发的change事件中通过previous或previousAttributes方法获取
                this._previousAttributes = _.clone(this.attributes);
            }

            // 执行完毕标识
            this._changing = false;
            return this;
        },
        // 检查某个数据是否在上一次执行change事件后被改变过
        /**
         * 一般在change事件中配合previous或previousAttributes方法使用, 如:
         * if(model.hasChanged('attr')) {
         *     var attrPrev = model.previous('attr');
         * }
         */
        hasChanged : function(attr) {
            if(!arguments.length)
                return !_.isEmpty(this.changed);
            return _.has(this.changed, attr);
        },
        // 获取当前模型中的数据与上一次数据中已经发生变化的数据集合
        // (一般在使用silent属性时没有调用change方法, 因此数据会被临时抱存在changed属性中, 上一次的数据可通过previousAttributes方法获取)
        // 如果传递了diff集合, 将使用上一次模型数据与diff集合中的数据进行比较, 返回不一致的数据集合
        // 如果比较结果中没有差异, 则返回false
        changedAttributes : function(diff) {
            // 如果没有指定diff, 将返回当前模型较上一次状态已改变的数据集合, 这些数据已经被存在changed属性中, 因此返回changed集合的一个副本
            if(!diff)
                return this.hasChanged() ? _.clone(this.changed) : false;
            // 指定了需要进行比较的diff集合, 将返回上一次的数据与diff集合的比较结果
            // old变量存储了上一个状态的模型数据
            var val, changed = false, old = this._previousAttributes;
            // 遍历diff集合, 并将每一项与上一个状态的集合进行比较
            for(var attr in diff) {
                // 将比较结果不一致的数据临时存储到changed变量
                if(_.isEqual(old[attr], ( val = diff[attr])))
                    continue;
                (changed || (changed = {}))[attr] = val;
            }
            // 返回比较结果
            return changed;
        },
        // 在模型触发的change事件中, 获取某个属性被改变前上一个状态的数据, 一般用于进行数据比较或回滚
        // 该方法一般在change事件中调用, change事件被触发后, _previousAttributes属性存放最新的数据
        previous : function(attr) {
            // attr指定需要获取上一个状态的属性名称
            if(!arguments.length || !this._previousAttributes)
                return null;
            return this._previousAttributes[attr];
        },
        // 在模型触发change事件中, 获取所有属性上一个状态的数据集合
        // 该方法类似于previous()方法, 一般在change事件中调用, 用于数据比较或回滚
        previousAttributes : function() {
            // 将上一个状态的数据对象克隆为一个新对象并返回
            return _.clone(this._previousAttributes);
        },
        // Check if the model is currently in a valid state. It's only possible to
        // get into an *invalid* state if you're using silent changes.
        // 验证当前模型中的数据是否能通过validate方法验证, 调用前请确保定义了validate方法
        isValid : function() {
            return !this.validate(this.attributes);
        },
        // 数据验证方法, 在调用set, save, add等数据更新方法时, 被自动执行
        // 验证失败会触发模型对象的"error"事件, 如果在options中指定了error处理函数, 则只会执行options.error函数
        // @param {Object} attrs 数据模型的attributes属性, 存储模型的对象化数据
        // @param {Object} options 配置项
        // @return {Boolean} 验证通过返回true, 不通过返回false
        _validate : function(attrs, options) {
            // 如果在调用set, save, add等数据更新方法时设置了options.silent属性, 则忽略验证
            // 如果Model中没有添加validate方法, 则忽略验证
            if(options.silent || !this.validate)
                return true;
            // 获取对象中所有的属性值, 并放入validate方法中进行验证
            // validate方法包含2个参数, 分别为模型中的数据集合与配置对象, 如果验证通过则不返回任何数据(默认为undefined), 验证失败则返回带有错误信息数据
            attrs = _.extend({}, this.attributes, attrs);
            var error = this.validate(attrs, options);
            // 验证通过
            if(!error)
                return true;
            // 验证未通过
            // 如果配置对象中设置了error错误处理方法, 则调用该方法并将错误数据和配置对象传递给该方法
            if(options && options.error) {
                options.error(this, error, options);
            } else {
                // 如果对模型绑定了error事件监听, 则触发绑定事件
                this.trigger('error', this, error, options);
            }
            // 返回验证未通过标识
            return false;
        }
    });

    // Backbone.Collection 数据模型集合相关
    // -------------------

    // Collection集合存储一系列相同类的数据模型, 并提供相关方法对模型进行操作
    var Collection = Backbone.Collection = function(models, options) {
        // 配置对象
        options || ( options = {});
        // 在配置参数中设置集合的模型类
        if(options.model)
            this.model = options.model;
        // 如果设置了comparator属性, 则集合中的数据将按照comparator方法中的排序算法进行排序(在add方法中会自动调用)
        if(options.comparator)
            this.comparator = options.comparator;
        // 实例化时重置集合的内部状态(第一次调用时可理解为定义状态)
        this._reset();
        // 调用自定义初始化方法, 如果需要一般会重载initialize方法
        this.initialize.apply(this, arguments);
        // 如果指定了models数据, 则调用reset方法将数据添加到集合中
        // 首次调用时设置了silent参数, 因此不会触发"reset"事件
        if(models)
            this.reset(models, {
                silent : true,
                parse : options.parse
            });
    };
    // 通过extend方法定义集合类原型方法
    _.extend(Collection.prototype, Events, {

        // 定义集合的模型类, 模型类必须是一个Backbone.Model的子类
        // 在使用集合相关方法(如add, create等)时, 允许传入数据对象, 集合方法会根据定义的模型类自动创建对应的实例
        // 集合中存储的数据模型应该都是同一个模型类的实例
        model : Model,

        // 初始化方法, 该方法在集合实例被创建后自动调用
        // 一般会在定义集合类时重载该方法
        initialize : function() {
        },
        // 返回一个数组, 包含了集合中每个模型的数据对象
        toJSON : function(options) {
            // 通过Undersocre的map方法将集合中每一个模型的toJSON结果组成一个数组, 并返回
            return this.map(function(model) {
                // 依次调用每个模型对象的toJSON方法, 该方法默认将返回模型的数据对象(复制的副本)
                // 如果需要返回字符串等其它形式, 可以重载toJSON方法
                return model.toJSON(options);
            });
        },
        // 向集合中添加一个或多个模型对象
        // 默认会触发"add"事件, 如果在options中设置了silent属性, 可以关闭此次事件触发
        // 传入的models可以是一个或一系列的模型对象(Model类的实例), 如果在集合中设置了model属性, 则允许直接传入数据对象(如 {name: 'test'}), 将自动将数据对象实例化为model指向的模型对象
        add : function(models, options) {
            // 局部变量定义
            var i, index, length, model, cid, id, cids = {}, ids = {}, dups = [];
            options || ( options = {});
            // models必须是一个数组, 如果只传入了一个模型, 则将其转换为数组
            models = _.isArray(models) ? models.slice() : [models];

            // 遍历需要添加的模型列表, 遍历过程中, 将执行以下操作:
            // - 将数据对象转化模型对象
            // - 建立模型与集合之间的引用
            // - 记录无效和重复的模型, 并在后面进行过滤
            for( i = 0, length = models.length; i < length; i++) {
                // 将数据对象转换为模型对象, 简历模型与集合的引用, 并存储到model(同时models中对应的模型已经被替换为模型对象)
                if(!( model = models[i] = this._prepareModel(models[i], options))) {
                    throw new Error("Can't add an invalid model to a collection");
                }
                // 当前模型的cid和id
                cid = model.cid;
                id = model.id;
                // dups数组中记录了无效或重复的模型索引(models数组中的索引), 并在下一步进行过滤删除
                // 如果cids, ids变量中已经存在了该模型的索引, 则认为是同一个模型在传入的models数组中声明了多次
                // 如果_byCid, _byId对象中已经存在了该模型的索引, 则认为同一个模型在当前集合中已经存在
                // 对于上述两种情况, 将模型的索引记录到dups进行过滤删除
                if(cids[cid] || this._byCid[cid] || ((id != null) && (ids[id] || this._byId[id]))) {
                    dups.push(i);
                    continue;
                }
                // 将models中已经遍历过的模型记录下来, 用于在下一次循环时进行重复检查
                cids[cid] = ids[id] = model;
            }

            // 从models中删除无效或重复的模型, 保留目前集合中真正需要添加的模型列表
            i = dups.length;
            while(i--) {
                models.splice(dups[i], 1);
            }

            // 遍历需要添加的模型, 监听模型事件并记录_byCid, _byId列表, 用于在调用get和getByCid方法时作为索引
            for( i = 0, length = models.length; i < length; i++) {
                // 监听模型中的所有事件, 并执行_onModelEvent方法
                // _onModelEvent方法中会对模型抛出的add, remove, destroy和change事件进行处理, 以便模型与集合中的状态保持同步
                ( model = models[i]).on('all', this._onModelEvent, this);
                // 将模型根据cid记录到_byCid对象, 便于根据cid进行查找
                this._byCid[model.cid] = model;
                // 将模型根据id记录到_byId对象, 便于根据id进行查找
                if(model.id != null)
                    this._byId[model.id] = model;
            }

            // 改变集合的length属性, length属性记录了当前集合中模型的数量
            this.length += length;
            // 设置新模型列表插入到集合中的位置, 如果在options中设置了at参数, 则在集合的at位置插入
            // 默认将插入到集合的末尾
            // 如果设置了comparator自定义排序方法, 则设置at后还将按照comparator中的方法进行排序, 因此最终的顺序可能并非在at指定的位置
            index = options.at != null ? options.at : this.models.length;
            splice.apply(this.models, [index, 0].concat(models));
            // 如果设置了comparator方法, 则将数据按照comparator中的算法进行排序
            // 自动排序使用silent属性阻止触发reset事件
            if(this.comparator)
                this.sort({
                    silent : true
                });
            // 依次对每个模型对象触发"add"事件, 如果设置了silent属性, 则阻止事件触发
            if(options.silent)
                return this;
            // 遍历新增加的模型列表
            for( i = 0, length = this.models.length; i < length; i++) {
                if(!cids[( model = this.models[i]).cid])
                    continue;
                options.index = i;
                // 触发模型的"add"事件, 因为集合监听了模型的"all"事件, 因此在_onModelEvent方法中, 集合也将触发"add"事件
                // 详细信息可参考Collection.prototype._onModelEvent方法
                model.trigger('add', model, this, options);
            }
            return this;
        },
        // 从集合中移除模型对象(支持移除多个模型)
        // 传入的models可以是需要移除的模型对象, 或模型的cid和模型的id
        // 移除模型并不会调用模型的destroy方法
        // 如果没有设置options.silent参数, 将触发模型的remove事件, 同时将触发集合的remove事件(集合通过_onModelEvent方法监听了模型的所有事件)
        remove : function(models, options) {
            var i, l, index, model;
            // options默认为空对象
            options || ( options = {});
            // models必须是数组类型, 当只移除一个模型时, 将其放入一个数组
            models = _.isArray(models) ? models.slice() : [models];
            // 遍历需要移除的模型列表
            for( i = 0, l = models.length; i < l; i++) {
                // 所传入的models列表中可以是需要移除的模型对象, 或模型的cid和模型的id
                // (在getByCid和get方法中, 可通过cid, id来获取模型, 如果传入的是一个模型对象, 则返回模型本身)
                model = this.getByCid(models[i]) || this.get(models[i]);
                // 没有获取到模型
                if(!model)
                    continue;
                // 从_byId列表中移除模型的id引用
                delete this._byId[model.id];
                // 从_byCid列表中移除模型的cid引用
                delete this._byCid[model.cid];
                // indexOf是Underscore对象中的方法, 这里通过indexOf方法获取模型在集合中首次出现的位置
                index = this.indexOf(model);
                // 从集合列表中移除该模型
                this.models.splice(index, 1);
                // 重置当前集合的length属性(记录集合中模型的数量)
                this.length--;
                // 如果没有设置silent属性, 则触发模型的remove事件
                if(!options.silent) {
                    // 将当前模型在集合中的位置添加到options对象并传递给remove监听事件, 以便在事件函数中可以使用
                    options.index = index;
                    model.trigger('remove', model, this, options);
                }
                // 解除模型与集合的关系, 包括集合中对模型的引用和事件监听
                this._removeReference(model);
            }
            return this;
        },
        // 向集合的末尾添加模型对象
        // 如果集合类中定义了comparator排序方法, 则通过push方法添加的模型将按照comparator定义的算法进行排序, 因此模型顺序可能会被改变
        push : function(model, options) {
            // 通过_prepareModel方法将model实例化为模型对象, 这句代码是多余的, 因为在下面调用的add方法中还会通过_prepareModel获取一次模型
            model = this._prepareModel(model, options);
            // 调用add方法将模型添加到集合中(默认添加到集合末尾)
            this.add(model, options);
            return model;
        },
        // 移除集合中最后一个模型对象
        pop : function(options) {
            // 获取集合中最后一个模型
            var model = this.at(this.length - 1);
            // 通过remove方法移除该模型
            this.remove(model, options);
            return model;
        },
        // 向集合的第一个位置插入模型
        // 如果集合类中定义了comparator排序方法, 则通过unshift方法添加的模型将按照comparator定义的算法进行排序, 因此模型顺序可能会被改变
        unshift : function(model, options) {
            // 通过_prepareModel方法将model实例化为模型对象
            model = this._prepareModel(model, options);
            // 调用add方法将模型插入到集合的第一个位置(设置at为0)
            // 如果定义了comparator排序方法, 集合的顺序将被重排
            this.add(model, _.extend({
                at : 0
            }, options));
            return model;
        },
        // 移除并返回集合中的第一个模型对象
        shift : function(options) {
            // 获得集合中的第一个模型
            var model = this.at(0);
            // 从集合中删除该模型
            this.remove(model, options);
            // 返回模型对象
            return model;
        },
        // 根据id从集合中查找模型并返回
        get : function(id) {
            if(id == null)
                return
                void 0;
            return this._byId[id.id != null ? id.id : id];
        },
        // 根据cid从集合中查找模型并返回
        getByCid : function(cid) {
            return cid && this._byCid[cid.cid || cid];
        },
        // 根据索引(下标, 从0开始)从集合中查找模型并返回
        at : function(index) {
            return this.models[index];
        },
        // 对集合中的模型根据值进行筛选
        // attrs是一个筛选对象, 如 {name: 'Jack'}, 将返回集合中所有name为"Jack"的模型(数组)
        where : function(attrs) {
            // attrs不能为空值
            if(_.isEmpty(attrs))
                return [];
            // 通过filter方法对集合中的模型进行筛选
            // filter方法是Underscore中的方法, 用于将遍历集合中的元素, 并将能通过处理器验证(返回值为true)的元素作为数组返回
            return this.filter(function(model) {
                // 遍历attrs对象中的验证规则
                for(var key in attrs) {
                    // 将attrs中的验证规则与集合中的模型进行匹配
                    if(attrs[key] !== model.get(key))
                        return false;
                }
                return true;
            });
        },
        // 对集合中的模型按照comparator属性指定的方法进行排序
        // 如果没有在options中设置silent参数, 则排序后将触发reset事件
        sort : function(options) {
            // options默认是一个对象
            options || ( options = {});
            // 调用sort方法必须指定了comparator属性(排序算法方法), 否则将抛出一个错误
            if(!this.comparator)
                throw new Error('Cannot sort a set without a comparator');
            // boundComparator存储了绑定当前集合上下文对象的comparator排序算法方法
            var boundComparator = _.bind(this.comparator, this);
            if(this.comparator.length == 1) {
                this.models = this.sortBy(boundComparator);
            } else {
                // 调用Array.prototype.sort通过comparator算法对数据进行自定义排序
                this.models.sort(boundComparator);
            }
            // 如果没有指定silent参数, 则触发reset事件
            if(!options.silent)
                this.trigger('reset', this, options);
            return this;
        },
        // 将集合中所有模型的attr属性值存放到一个数组并返回
        pluck : function(attr) {
            // map是Underscore中的方法, 用于遍历一个集合, 并将所有处理器的返回值作为一个数组返回
            return _.map(this.models, function(model) {
                // 返回当前模型的attr属性值
                return model.get(attr);
            });
        },
        // 替换集合中的所有模型数据(models)
        // 该操作将删除集合中当前的所有数据和状态, 并重新将数据设置为models
        // models应该是一个数组, 可以包含一系列Model模型对象, 或原始对象(将在add方法中自动创建为模型对象)
        reset : function(models, options) {
            // models是进行替换的模型(或数据)数组
            models || ( models = []);
            // options默认是一个空对象
            options || ( options = {});
            // 遍历当前集合中的模型, 依次删除并解除它们与集合的引用关系
            for(var i = 0, l = this.models.length; i < l; i++) {
                this._removeReference(this.models[i]);
            }
            // 删除集合数据并重置状态
            this._reset();
            // 通过add方法将新的模型数据添加到集合
            // 这里通过exnted方法将配置项覆盖到一个新的对象, 该对象默认silent为true, 因此不会触发"add"事件
            // 如果在调用reset方法时没有设置silent属性则会触发reset事件, 如果设置为true则不会触发任何事件, 如果设置为false, 将依次触发"add"和"reset"事件
            this.add(models, _.extend({
                silent : true
            }, options));
            // 如果在调用reset方法时没有设置silent属性, 则触发reset事件
            if(!options.silent)
                this.trigger('reset', this, options);
            return this;
        },
        // 从服务器获取集合的初始化数据
        // 如果在options中设置参数add=true, 则获取到的数据会被追加到集合中, 否则将以服务器返回的数据替换集合中的当前数据
        fetch : function(options) {
            // 复制options对象, 因为options对象在后面会被修改用于临时存储数据
            options = options ? _.clone(options) : {};
            if(options.parse === undefined)
                options.parse = true;
            // collection记录当前集合对象, 用于在success回调函数中使用
            var collection = this;
            // 自定义回调函数, 数据请求成功后并添加完成后, 会调用自定义success函数
            var success = options.success;
            // 当从服务器请求数据成功时执行options.success, 该函数中将解析并添加数据
            options.success = function(resp, status, xhr) {
                // 通过parse方法对服务器返回的数据进行解析, 如果需要自定义数据结构, 可以重载parse方法
                // 如果在options中设置add=true, 则调用add方法将数据添加到集合, 否则将通过reset方法将集合中的数据替换为服务器的返回数据
                collection[options.add ? 'add' : 'reset'](collection.parse(resp, xhr), options);
                // 如果设置了自定义成功回调, 则执行
                if(success)
                    success(collection, resp);
            };
            // 当服务器返回状态错误时, 通过wrapError方法处理错误事件
            options.error = Backbone.wrapError(options.error, collection, options);
            // 调用Backbone.sync方法发送请求从服务器获取数据
            // 如果需要的数据并不是从服务器获取, 或获取方式不使用AJAX, 可以重载Backbone.sync方法
            return (this.sync || Backbone.sync).call(this, 'read', this, options);
        },
        // 向集合中添加并创建一个模型, 同时将该模型保存到服务器
        // 如果是通过数据对象来创建模型, 需要在集合中声明model属性对应的模型类
        // 如果在options中声明了wait属性, 则会在服务器创建成功后再将模型添加到集合, 否则先将模型添加到集合, 再保存到服务器(无论保存是否成功)
        create : function(model, options) {
            var coll = this;
            // 定义options对象
            options = options ? _.clone(options) : {};
            // 通过_prepareModel获取模型类的实例
            model = this._prepareModel(model, options);
            // 模型创建失败
            if(!model)
                return false;
            // 如果没有声明wait属性, 则通过add方法将模型添加到集合中
            if(!options.wait)
                coll.add(model, options);
            // success存储保存到服务器成功之后的自定义回调函数(通过options.success声明)
            var success = options.success;
            // 监听模型数据保存成功后的回调函数
            options.success = function(nextModel, resp, xhr) {
                // 如果声明了wait属性, 则在只有在服务器保存成功后才会将模型添加到集合中
                if(options.wait)
                    coll.add(nextModel, options);
                // 如果声明了自定义成功回调, 则执行自定义函数, 否则将默认触发模型的sync事件
                if(success) {
                    success(nextModel, resp);
                } else {
                    nextModel.trigger('sync', model, resp, options);
                }
            };
            // 调用模型的save方法, 将模型数据保存到服务器
            model.save(null, options);
            return model;
        },
        // 数据解析方法, 用于将服务器数据解析为模型和集合可用的结构化数据
        // 默认将返回resp本身, 这需要与服务器定义Backbone支持的数据格式, 如果需要自定义数据格式, 可以重载parse方法
        parse : function(resp, xhr) {
            return resp;
        },
        // chain用于构建集合数据的链式操作, 它将集合中的数据转换为一个Underscore对象, 并使用Underscore的chain方法转换为链式结构
        // 关于chain方法的转换方式, 可参考Underscore中chain方法的注释
        chain : function() {
            return _(this.models).chain();
        },
        // 删除所有集合元素并重置集合中的数据状态
        _reset : function(options) {
            // 删除集合元素
            this.length = 0;
            this.models = [];
            // 重置集合状态
            this._byId = {};
            this._byCid = {};
        },
        // 将模型添加到集合中之前的一些准备工作
        // 包括将数据实例化为一个模型对象, 和将集合引用到模型的collection属性
        _prepareModel : function(model, options) {
            options || ( options = {});
            // 检查model是否是一个模型对象(即Model类的实例)
            if(!( model instanceof Model)) {
                // 传入的model是模型数据对象, 而并非模型对象
                // 将数据作为参数传递给Model, 以创建一个新的模型对象
                var attrs = model;
                // 设置模型引用的集合
                options.collection = this;
                // 将数据转化为模型
                model = new this.model(attrs, options);
                // 对模型中的数据进行验证
                if(!model._validate(model.attributes, options))
                    model = false;
            } else if(!model.collection) {
                // 如果传入的是一个模型对象但没有建立与集合的引用, 则设置模型的collection属性为当前集合
                model.collection = this;
            }
            return model;
        },
        // 解绑某个模型与集合的关系, 包括对集合的引用和事件监听
        // 一般在调用remove方法删除模型或调用reset方法重置状态时自动调用
        _removeReference : function(model) {
            // 如果模型引用了当前集合, 则移除该引用(必须确保所有对模型的引用已经解除, 否则模型可能无法从内存中释放)
            if(this == model.collection) {
                delete model.collection;
            }
            // 取消集合中监听的所有模型事件
            model.off('all', this._onModelEvent, this);
        },
        // 在向集合中添加模型时被自动调用
        // 用于监听集合中模型的事件, 当模型在触发事件(add, remove, destroy, change事件)时集合进行相关处理
        _onModelEvent : function(event, model, collection, options) {
            // 添加和移除模型的事件, 必须确保模型所属的集合为当前集合对象
            if((event == 'add' || event == 'remove') && collection != this)
                return;
            // 模型触发销毁事件时, 从集合中移除
            if(event == 'destroy') {
                this.remove(model, options);
            }
            // 当模型的id被修改时, 集合修改_byId中存储对模型的引用, 保持与模型id的同步, 便于使用get()方法获取模型对象
            if(model && event === 'change:' + model.idAttribute) {
                // 获取模型在改变之前的id, 并根据此id从集合的_byId列表中移除
                delete this._byId[model.previous(model.idAttribute)];
                // 以模型新的id作为key, 在_byId列表中存放对模型的引用
                this._byId[model.id] = model;
            }
            // 在集合中触发模型对应的事件, 无论模型触发任何事件, 集合都会触发对应的事件
            // (例如当模型被添加到集合中时, 会触发模型的"add"事件, 同时也会在此方法中触发集合的"add"事件)
            // 这对于监听并处理集合中模型状态的变化非常有效
            // 在监听的集合事件中, 触发对应事件的模型会被作为参数传递给集合的监听函数
            this.trigger.apply(this, arguments);
        }
    });

    // 定义Underscore中的集合操作的相关方法
    // 将Underscore中一系列集合操作方法复制到Collection集合类的原型对象中
    // 这样就可以直接通过集合对象调用Underscore相关的集合方法
    // 这些方法在调用时所操作的集合数据是当前Collection对象的models数据
    var methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find', 'detect', 'filter', 'select', 'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex', 'toArray', 'size', 'first', 'initial', 'rest', 'last', 'without', 'indexOf', 'shuffle', 'lastIndexOf', 'isEmpty', 'groupBy'];

    // 遍历已经定义的方法列表
    _.each(methods, function(method) {
        // 将方法复制到Collection集合类的原型对象
        Collection.prototype[method] = function() {
            // 调用时直接使用Underscore的方法, 上下文对象保持为Underscore对象
            // 需要注意的是这里传递给Underscore方法的集合参数是 this.models, 因此在使用这些方法时, 所操作的集合对象是当前Collection对象的models数据
            return _[method].apply(_, [this.models].concat(_.toArray(arguments)));
        };
    });
    // Backbone.Router URL路由器
    // -------------------

    // 通过继承Backbone.Router类实现自定义的路由器
    // 路由器允许定义路由规则, 通过URL片段进行导航, 并将每一个规则对应到一个方法, 当URL匹配某个规则时会自动执行该方法
    // 路由器通过URL进行导航, 导航方式分为pushState, Hash, 和监听方式(详细可参考Backbone.History类)
    // 在创建Router实例时, 通过options.routes来设置某个路由规则对应的监听方法
    // options.routes中的路由规则按照 {规则名称: 方法名称}进行组织, 每一个路由规则所对应的方法, 都必须是在Router实例中的已经声明的方法
    // options.routes定义的路由规则按照先后顺序进行匹配, 如果当前URL能被多个规则匹配, 则只会执行第一个匹配的事件方法
    var Router = Backbone.Router = function(options) {
        // options默认是一个空对象
        options || ( options = {});
        // 如果在options中设置了routes对象(路由规则), 则赋给当前实例的routes属性
        // routes属性记录了路由规则与事件方法的绑定关系, 当URL与某一个规则匹配时, 会自动调用关联的事件方法
        if(options.routes)
            this.routes = options.routes;
        // 解析和绑定路由规则
        this._bindRoutes();
        // 调用自定义的初始化方法
        this.initialize.apply(this, arguments);
    };
    // 定义用于将字符串形式的路由规则, 转换为可执行的正则表达式规则时的查找条件
    // (字符串形式的路由规则, 通过\w+进行匹配, 因此只支持字母数字和下划线组成的字符串)
    // 匹配一个URL片段中(以/"斜线"为分隔)的动态路由规则
    // 如: (topic/:id) 匹配 (topic/1228), 监听事件function(id) { // id为1228 }
    var namedParam = /:\w+/g;
    // 匹配整个URL片段中的动态路由规则
    // 如: (topic*id) 匹配 (url#/topic1228), 监听事件function(id) { // id为1228 }
    var splatParam = /\*\w+/g;
    // 匹配URL片段中的特殊字符, 并在字符前加上转义符, 防止特殊字符在被转换为正则表达式后变成元字符
    // 如: (abc)^[,.] 将被转换为 \(abc\)\^\[\,\.\]
    var escapeRegExp = /[-[\]{}()+?.,\\^$|#\s]/g;

    // 向Router类的原型对象中扩展属性和方法
    _.extend(Router.prototype, Events, {

        // 自定义初始化方法, 在路由器Router实例化后被自动调用
        initialize : function() {
        },
        // 将一个路由规则绑定给一个监听事件, 当URL片段匹配该规则时, 会自动调用触发该事件
        route : function(route, name, callback) {
            // 创建history实例, Backbone.history是一个单例对象, 只在第一次创建路由器对象时被实例化
            Backbone.history || (Backbone.history = new History);
            // 检查route规则名称是否为一个字符串(当手动调用route方法创建路由规则时, 允许传递一个正则表达式或字符串作为规则)
            // 在构造Router实例时传入options.routes中的规则, 都应该是一个字符串(因为在_bindRoutes方法中将routes配置中的key作为路由规则)
            // 如果传入的是字符串类型的路由规则, 通过_routeToRegExp方法将其转换为一个正则表达式, 用于匹配URL片段
            if(!_.isRegExp(route))
                route = this._routeToRegExp(route);
            // 如果没有设置callback(事件方法), 则根据name从当前Router实例中获取与name同名的方法
            // 这是因为在手动调用route方法时可能不会传递callback方法, 但必须传递name事件名称, 并在Router实例中已经定义了该方法
            if(!callback)
                callback = this[name];
            // 调用history实例的route方法, 该方法会将转换后的正则表达式规则, 和监听事件方法绑定到history.handlers列表中, 以便history进行路由和控制
            // 当history实例匹配到对应的路由规则而调用该事件时, 会将URL片段作为字符串(即fragment参数)传递给该事件方法
            // 这里并没有直接将监听事件传递给history的route方法, 而是使用bind方法封装了另一个函数, 该函数的执行上下文为当前Router对象
            Backbone.history.route(route, _.bind(function(fragment) {
                // 调用_extractParameters方法获取匹配到的规则中的参数
                var args = this._extractParameters(route, fragment);
                // 调用callback路由监听事件, 并将参数传递给监听事件
                callback && callback.apply(this, args);
                // 触发route:name事件, name为调用route时传递的事件名称
                // 如果对当前Router实例使用on方法绑定了route:name事件, 则会收到该事件的触发通知
                this.trigger.apply(this, ['route:' + name].concat(args));
                // 触发history实例中绑定的route事件, 当路由器匹配到任何规则时, 均会触发该事件
                Backbone.history.trigger('route', this, name, args);
                /**
                 * 事件绑定如:
                 * var router = new MyRouter();
                 * router.on('route:routename', function(param) {
                 *     // 绑定到Router实例中某个规则的事件, 当匹配到该规则时触发
                 * });
                 * Backbone.history.on('route', function(router, name, args) {
                 *     // 绑定到history实例中的事件, 当匹配到任何规则时触发
                 * });
                 * Backbone.history.start();
                 */
            }, this));
            return this;
        },
        // 通过调用history.navigate方法, 手动设置跳转到URL
        navigate : function(fragment, options) {
            // 代理到history实例的navigate方法
            Backbone.history.navigate(fragment, options);
        },
        // 解析当前实例定义的路由(this.routes)规则, 并调用route方法将每一个规则绑定到对应的方法
        _bindRoutes : function() {
            // 如果在创建对象时没有设置routes规则, 则不进行解析和绑定
            if(!this.routes)
                return;
            // routes变量以二维数组的形式存储倒序排列的路由规则
            // 如[['', 'homepage'], ['controller:name', 'toController']]
            var routes = [];
            // 遍历routes配置
            for(var route in this.routes) {
                // 将路由规则放入一个新的数组, 按照[规则名称, 绑定方法]组织
                // 将该数组通过unshift方法放置到routes顶部, 实现倒序排列
                // 这里将routes中的规则倒序排列, 在后面调用route方法时会再次调用unshift将顺序倒过来, 以保证最终的顺序是按照routes配置中定义的顺序来执行的
                // 倒换两次顺序后, 会重新恢复最初调用前的顺序, 之所以这样做, 是因为用户可以手动调用route方法动态添加路由规则, 而手动添加的路由规则会被添加到列表的第一个, 因此要在route方法中使用unshift来插入规则
                // 而构造Router实例时自动添加的规则, 为了保持定义顺序, 因此在此处将定义的规则倒序排列
                routes.unshift([route, this.routes[route]]);
            }
            // 循环完毕, 此时routes中存储了倒序排列的路由规则

            // 循环路由规则, 并依次调用route方法, 将规则名称绑定到具体的事件函数
            for(var i = 0, l = routes.length; i < l; i++) {
                // 调用route方法, 并分别传递(规则名称, 事件函数名, 事件函数对象)
                this.route(routes[i][0], routes[i][1], this[routes[i][1]]);
            }
        },
        // 将字符串形式的路由规则转换为正则表达式对象
        // (在route方法中检查到字符串类型的路由规则后, 会自动调用该方法进行转换)
        _routeToRegExp : function(route) {
            // 为字符串中特殊字符添加转义符, 防止特殊字符在被转换为正则表达式后变成元字符(这些特殊字符包括-[\]{}()+?.,\\^$|#\s)
            // 将字符串中以/"斜线"为分隔的动态路由规则转换为([^\/]+), 在正则中表示以/"斜线"开头的多个字符
            // 将字符串中的*"星号"动态路由规则转换为(.*?), 在正则中表示0或多个任意字符(这里使用了非贪婪模式, 因此你可以使用例如这样的组合路由规则: *list/:id, 将匹配 orderlist/123 , 同时会将"order"和"123"作为参数传递给事件方法 )
            // 请注意namedParam和splatParam替换后的正则表达式都是用()括号将匹配的内容包含起来, 这是为了方便取出匹配的内容作为参数传递给事件方法
            // 请注意namedParam和splatParam匹配的字符串 :str, *str中的str字符串是无意义的, 它们会在下面替换后被忽略, 但一般写作和监听事件方法的参数同名, 以便进行标识
            route = route.replace(escapeRegExp, '\\$&').replace(namedParam, '([^\/]+)').replace(splatParam, '(.*?)');
            // 将转换后的字符串创建为正则表达式对象并返回
            // 这个正则表达式将根据route字符串中的规则, 用于匹配URL片段
            return new RegExp('^' + route + '$');
        },
        // 传入一个路由规则(正则表达式)和URL片段(字符串)进行匹配, 并返回从匹配的字符串中获取参数
        /**
         * 例如路由规则为 'teams/:type/:id', 对应的正则表达式会被转换为/^teams/([^/]+)/([^/]+)$/ , (对路由规则转换为正则表达式的过程可参考_routeToRegExp方法)
         * URL片段为 'teams/35/1228'
         * 则通过exec执行后的结果为 ["teams/35/1228", "35", "1228"]
         * 数组中的一个元素是URL片段字符串本身, 从第二个开始则依次为路由规则表达式中的参数
         */
        _extractParameters : function(route, fragment) {
            return route.exec(fragment).slice(1);
        }
    });

    // Backbone.History 路由器管理
    // ----------------

    // History类提供路由管理相关操作, 包括监听URL的变化, (通过popstate和onhashchange事件进行监听, 对于不支持事件的浏览器通过setInterval心跳监控)
    // 提供路由规则与当前URL的匹配验证, 和触发相关的监听事件
    // History一般不会被直接调用, 在第一次实例化Router对象时, 将自动创建一个History的单例(通过Backbone.history访问)
    var History = Backbone.History = function() {
        // handlers属性记录了当前所有路由对象中已经设置的规则和监听列表
        // 形式如: [{route: route, callback: callback}], route记录了正则表达式规则, callback记录了匹配规则时的监听事件
        // 当history对象监听到URL发生变化时, 会自动与handlers中定义的规则进行匹配, 并调用监听事件
        this.handlers = [];
        // 将checkUrl方法的上下文对象绑定到history对象, 因为checkUrl方法被作为popstate和onhashchange事件或setInterval的回调函数, 在执行回调时, 上下文对象会被改变
        // checkUrl方法用于在监听到URL发生变化时检查并调用loadUrl方法
        _.bindAll(this, 'checkUrl');
    };
    // 定义用于匹配URL片段中首字符是否为"#"或"/"的正则
    var routeStripper = /^[#\/]/;

    // 定义用于匹配从userAgent中获取的字符串是否包含IE浏览器的标识, 用于判断当前浏览器是否为IE
    var isExplorer = /msie [\w.]+/;

    // 记录当前history单例对象是否已经被初始化过(调用start方法)
    History.started = false;

    // 向History类的原型对象中添加方法, 这些方法可以通过History的实例调用(即Backbone.history对象)
    _.extend(History.prototype, Events, {

        // 当用户使用低版本的IE浏览器(不支持onhashchange事件)时, 通过心跳监听路由状态的变化
        // interval属性设置心跳频率(毫秒), 该频率如果太低可能会导致延迟, 如果太高可能会消耗CPU资源(需要考虑用户使用低端浏览器时的设备配置)
        interval : 50,

        // 获取location中Hash字符串(锚点#后的片段)
        getHash : function(windowOverride) {
            // 如果传入了一个window对象, 则从该对象中获取, 否则默认从当前window对象中获取
            var loc = windowOverride ? windowOverride.location : window.location;
            // 将锚点(#)后的字符串提取出来并返回
            var match = loc.href.match(/#(.*)$/);
            // 如果没有找到匹配的内容, 则返回空字符串
            return match ? match[1] : '';
        },
        // 根据当前设置的路由方式, 处理并返回当前URL中的路由片段
        getFragment : function(fragment, forcePushState) {
            // fragment是通过getHash或从URL中已经提取的待处理路由片段(如 #/id/1288)
            if(fragment == null) {// 如果没有传递fragment, 则根据当前路由方式进行提取
                if(this._hasPushState || forcePushState) {
                    // 使用了pushState方式进行路由
                    // fragment记录当前域名后的URL路径
                    fragment = window.location.pathname;
                    // search记录当前页面后的参数内容
                    var search = window.location.search;
                    // 将路径和参数合并在一起, 作为待处理的路由片段
                    if(search)
                        fragment += search;
                } else {
                    // 使用了hash方式进行路由
                    // 通过getHash方法获取当前锚点(#)后的字符串作为路由片段
                    fragment = this.getHash();
                }
            }
            // 根据配置项中设置的root参数, 则从路由片段取出root路径之后的内容
            if(!fragment.indexOf(this.options.root))
                fragment = fragment.substr(this.options.root.length);
            // 如果URL片段首字母为"#"或"/", 则去除该字符
            // 返回处理之后的URL片段
            return fragment.replace(routeStripper, '');
        },
        // 初始化History实例, 该方法只会被调用一次, 应该在创建并初始化Router对象之后被自动调用
        // 该方法作为整个路由的调度器, 它将针对不同浏览器监听URL片段的变化, 负责验证并通知到监听函数
        start : function(options) {
            // 如果history对象已经被初始化过, 则抛出错误
            if(History.started)
                throw new Error("Backbone.history has already been started");
            // 设置history对象的初始化状态
            History.started = true;

            // 设置配置项, 使用调用start方法时传递的options配置项覆盖默认配置
            this.options = _.extend({}, {
                // root属性设置URL导航中的路由根目录
                // 如果使用pushState方式进行路由, 则root目录之后的地址会根据不同的路由产生不同的地址(这可能会定位到不同的页面, 因此需要确保服务器支持)
                // 如果使用Hash锚点的方式进行路由, 则root表示URL后锚点(#)的位置
                root : '/'
            }, this.options, options);
            /**
             * history针对不同浏览器特性, 实现了3种方式的监听:
             * - 对于支持HTML5中popstate事件的浏览器, 通过popstate事件进行监听
             * - 对于不支持popstate的浏览器, 使用onhashchange事件进行监听(通过改变hash(锚点)设置的URL在被载入时会触发onhashchange事件)
             * - 对于不支持popstate和onhashchange事件的浏览器, 通过保持心跳监听
             *
             * 关于HTML5中popstate事件的相关方法:
             * - pushState可以将指定的URL添加一个新的history实体到浏览器历史里
             * - replaceState方法可以将当前的history实体替换为指定的URL
             * 使用pushState和replaceState方法时仅替换当前URL, 而并不会真正转到这个URL(当使用后退或前进按钮时, 也不会跳转到该URL)
             * (这两个方法可以解决在AJAX单页应用中浏览器前进, 后退操作的问题)
             * 当使用pushState或replaceState方法替换的URL, 在被载入时会触发onpopstate事件
             * 浏览器支持情况:
             * Chrome 5, Firefox 4.0, IE 10, Opera 11.5, Safari 5.0
             *
             * 注意:
             * - history.start方法默认使用Hash方式进行导航
             * - 如果需要启用pushState方式进行导航, 需要在调用start方法时, 手动传入配置options.pushState
             *   (设置前请确保浏览器支持pushState特性, 否则将默认转换为Hash方式)
             * - 当使用pushState方式进行导航时, URL可能会从options.root指定的根目录后发生变化, 这可能会导航到不同页面, 因此请确保服务器已经支持pushState方式的导航
             */
            // _wantsHashChange属性记录是否希望使用hash(锚点)的方式来记录和导航路由器
            // 除非在options配置项中手动设置hashChange为false, 否则默认将使用hash锚点的方式
            // (如果手动设置了options.pushState为true, 且浏览器支持pushState特性, 则会使用pushState方式)
            this._wantsHashChange = this.options.hashChange !== false;
            // _wantsPushState属性记录是否希望使用pushState方式来记录和导航路由器
            // pushState是HTML5中为window.history添加的新特性, 如果没有手动声明options.pushState为true, 则默认将使用hash方式
            this._wantsPushState = !!this.options.pushState;
            // _hasPushState属性记录浏览器是否支持pushState特性
            // 如果在options中设置了pushState(即希望使用pushState方式), 则检查浏览器是否支持该特性
            this._hasPushState = !!(this.options.pushState && window.history && window.history.pushState);
            // 获取当前URL中的路由字符串
            var fragment = this.getFragment();
            // documentMode是IE浏览器的独有属性, 用于标识当前浏览器使用的渲染模式
            var docMode = document.documentMode;
            // oldIE用于检查当前浏览器是否为低版本的IE浏览器(即IE 7.0以下版本)
            // 这句代码可理解为: 当前浏览器为IE, 但不支持documentMode属性, 或documentMode属性返回的渲染模式为IE7.0以下
            var oldIE = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

            if(oldIE) {
                // 如果用户使用低版本的IE浏览器, 不支持popstate和onhashchange事件
                // 向DOM中插入一个隐藏的iframe, 并通过改变和心跳监听该iframe的URL实现路由
                this.iframe = $('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
                // 通过navigate将iframe设置到当前的URL片段, 这并不会真正加载到一个页面, 因为fragment并非一个完整的URL
                this.navigate(fragment);
            }

            // 开始监听路由状态变化
            if(this._hasPushState) {
                // 如果使用了pushState方式路由, 且浏览器支持该特性, 则将popstate事件监听到checkUrl方法
                $(window).bind('popstate', this.checkUrl);
            } else if(this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
                // 如果使用Hash方式进行路由, 且浏览器支持onhashchange事件, 则将hashchange事件监听到checkUrl方法
                $(window).bind('hashchange', this.checkUrl);
            } else if(this._wantsHashChange) {
                // 对于低版本的浏览器, 通过setInterval方法心跳监听checkUrl方法, interval属性标识心跳频率
                this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
            }

            // 记录当前的URL片段
            this.fragment = fragment;
            // 验证当前是否处于根路径(即options.root中所配置的路径)
            var loc = window.location;
            var atRoot = loc.pathname == this.options.root;

            // 如果用户通过pushState方式的URL访问到当前地址, 但用户此时所使用的浏览器并不支持pushState特性
            // (这可能是某个用户通过pushState方式访问该应用, 然后将地址分享给其他用户, 而其他用户的浏览器并不支持该特性)
            if(this._wantsHashChange && this._wantsPushState && !this._hasPushState && !atRoot) {
                // 获取当前pushState方式中的URL片段, 并通过Hash方式重新打开页面
                this.fragment = this.getFragment(null, true);
                // 例如hashState方式的URL为 /root/topic/12001, 重新打开的Hash方式的URL则为 /root#topic/12001
                window.location.replace(this.options.root + '#' + this.fragment);
                return true;

                // 如果用户通过Hash方式的URL访问到当前地址, 但调用Backbone.history.start方法时设置了pushState(希望通过pushState方式进行路由)
                // 且用户浏览器支持pushState特性, 则将当前URL替换为pushState方式(注意, 这里使用replaceState方式进行替换URL, 而页面不会被刷新)
                // 以下分支条件可理解为: 如果我们希望使用pushState方式进行路由, 且浏览器支持该特性, 同时用户还使用了Hash方式打开当前页面
                // (这可能是某个用户使用Hash方式浏览到一个URL, 并将URL分享给另一个浏览器支持pushState特性的用户, 当该用户访问时会执行此分支)
            } else if(this._wantsPushState && this._hasPushState && atRoot && loc.hash) {
                // 获取URL中的Hash片段, 并清除字符串首个"#"或"/"
                this.fragment = this.getHash().replace(routeStripper, '');
                // 使用replaceState方法将当前浏览器的URL替换为pushState支持的方式, 即: 协议//主机地址/URL路径/Hash参数, 例如:
                // 当用户访问Hash方式的URL为 /root/#topic/12001, 将被替换为 /root/topic/12001
                // 注:
                // pushState和replaceState方法的参数有3个, 分别是state, title, url
                // -state: 用于存储插入或修改的history实体信息
                // -title: 用于设置浏览器标题(属于保留参数, 目前浏览器还没有实现该特性)
                // -url: 设置history实体的URL地址(可以是绝对或相对路径, 但无法设置跨域URL)
                window.history.replaceState({}, document.title, loc.protocol + '//' + loc.host + this.options.root + this.fragment);
            }

            // 一般调用start方法时会自动调用loadUrl, 匹配当前URL片段对应的路由规则, 调用该规则的方法
            // 如果设置了silent属性为true, 则loadUrl方法不会被调用
            // 这种情况一般出现在调用了stop方法重置history对象状态后, 再次调用start方法启动(实际上此时并非为页面初始化, 因此会设置silent属性)
            if(!this.options.silent) {
                return this.loadUrl();
            }
        },
        // 停止history对路由的监控, 并将状态恢复为未监听状态
        // 调用stop方法之后, 可重新调用start方法开始监听, stop方法一般用户在调用start方法之后, 需要重新设置start方法的参数, 或用于单元测试
        stop : function() {
            // 解除对浏览器路由的onpopstate和onhashchange事件的监听
            $(window).unbind('popstate', this.checkUrl).unbind('hashchange', this.checkUrl);
            // 停止对于低版本的IE浏览器的心跳监控
            clearInterval(this._checkUrlInterval);
            // 恢复started状态, 便于下次重新调用start方法
            History.started = false;
        },
        // 向handlers中绑定一个路由规则(参数route, 类型为正则表达式)与事件(参数callback)的映射关系(该方法由Router的实例自动调用)
        route : function(route, callback) {
            // 将route和callback插入到handlers列表的第一个位置
            // 这是为了确保最后调用route时传入的规则被优先进行匹配
            this.handlers.unshift({
                // 路由规则(正则)
                route : route,
                // 匹配规则时执行的方法
                callback : callback
            });
        },
        // 检查当前的URL相对上一次的状态是否发生了变化
        // 如果发生变化, 则记录新的URL状态, 并调用loadUrl方法触发新URL与匹配路由规则的方法
        // 该方法在onpopstate和onhashchange事件被触发后自动调用, 或者在低版本的IE浏览器中由setInterval心跳定时调用
        checkUrl : function(e) {
            // 获取当前的URL片段
            var current = this.getFragment();
            // 对低版本的IE浏览器, 将从iframe中获取最新的URL片段并赋给current变量
            if(current == this.fragment && this.iframe)
                current = this.getFragment(this.getHash(this.iframe));
            // 如果当前URL与上一次的状态没有发生任何变化, 则停止执行
            if(current == this.fragment)
                return false;
            // 执行到这里, URL已经发生改变, 调用navigate方法将URL设置为当前URL
            // 这里在自动调用navigate方法时, 并没有传递options参数, 因此不会触发navigate方法中的loadUrl方法
            if(this.iframe)
                this.navigate(current);
            // 调用loadUrl方法, 检查匹配的规则, 并执行规则绑定的方法
            // 如果调用this.loadUrl方法没有成功, 则试图在调用loadUrl方法时, 将重新获取的当前Hash传递给该方法
            this.loadUrl() || this.loadUrl(this.getHash());
        },
        // 根据当前URL, 与handler路由列表中的规则进行匹配
        // 如果URL符合某一个规则, 则执行这个规则所对应的方法, 函数将返回true
        // 如果没有找到合适的规则, 将返回false
        // loadUrl方法一般在页面初始化时调用start方法会被自动调用(除非设置了silent参数为true)
        // - 或当用户改变URL后, 由checkUrl监听到URL发生变化时被调用
        // - 或当调用navigate方法手动导航到某个URL时被调用
        loadUrl : function(fragmentOverride) {
            // 获取当前URL片段
            var fragment = this.fragment = this.getFragment(fragmentOverride);
            // 调用Undersocre的any方法, 将URL片段与handlers中的所有规则依次进行匹配
            var matched = _.any(this.handlers, function(handler) {
                // 如果handlers中的规则与当前URL片段匹配, 则执行该归额对应的方法, 并返回true
                if(handler.route.test(fragment)) {
                    handler.callback(fragment);
                    return true;
                }
            });
            // matched是any方法的返回值, 如果匹配到规则则返回true, 没有匹配到返回false
            return matched;
        },
        // 导航到指定的URL
        // 如果在options中设置了trigger, 将触发导航的URL与对应路由规则的事件
        // 如果在options中设置了replace, 将使用需要导航的URL替换当前的URL在history中的位置
        navigate : function(fragment, options) {
            // 如果没有调用start方法, 或已经调用stop方法, 则无法导航
            if(!History.started)
                return false;
            // 如果options参数不是一个对象, 而是true值, 则默认trigger配置项为true(即触发导航的URL与对应路由规则的事件)
            if(!options || options === true)
                options = {
                    trigger : options
                };
            // 将传递的fragment(URL片段)去掉首字符的"#"或"/"
            var frag = (fragment || '').replace(routeStripper, '');
            // 如果当前URL与需要导航的URL没有变化, 则不继续执行
            if(this.fragment == frag)
                return;

            // 如果当前支持并使用了pushState方式进行导航
            if(this._hasPushState) {
                // 构造一个完整的URL, 如果当前URL片段中没有包含根路径, 则使用根路径连接URL片段
                if(frag.indexOf(this.options.root) != 0)
                    frag = this.options.root + frag;
                // 设置新的URL
                this.fragment = frag;
                // 如果在options选项中设置了replace属性, 则将新的URL替换到history中的当前URL, 否则默认将新的URL追加到history中
                window.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, frag);

                // 如果使用hash方式进行导航
            } else if(this._wantsHashChange) {
                // 设置新的hash
                this.fragment = frag;
                // 调用_updateHash方法更新当前URL为新的hash, 并将options中的replace配置传递给_updateHash方法(在该方法中实现替换或追加新的hash)
                this._updateHash(window.location, frag, options.replace);
                // 对于低版本的IE浏览器, 当Hash发生变化时, 更新iframe URL中的Hash
                if(this.iframe && (frag != this.getFragment(this.getHash(this.iframe)))) {
                    // 如果使用了replace参数替换当前URL, 则直接将iframe替换为新的文档
                    // 调用document.open打开一个新的文档, 以擦除当前文档中的内容(这里调用close方法是为了关闭文档的状态)
                    // open和close方法之间没有使用write或writeln方法输出内容, 因此这是一个空文档
                    if(!options.replace)
                        this.iframe.document.open().close();
                    // 调用_updateHash方法更新iframe中的URL
                    this._updateHash(this.iframe.location, frag, options.replace);
                }

            } else {
                // 如果在调用start方法时, 手动设置hashChange参数为true, 不希望使用pushState和hash方式导航
                // 则直接将页面跳转到新的URL
                window.location.assign(this.options.root + fragment);
            }
            // 如果在options配置项中设置了trigger属性, 则调用loadUrl方法查找路由规则, 并执行规则对应的事件
            // 在URL发生变化时, 通过checkUrl方法监听到的状态, 会在checkUrl方法中自动调用loadUrl方法
            // 在手动调用navigate方法时, 如果需要触发路由事件, 则需要传递trigger参数
            if(options.trigger)
                this.loadUrl(fragment);
        },
        // 更新或设置当前URL中的Has串, _updateHash方法在使用hash方式导航时被自动调用(navigate方法中)
        // location是需要更新hash的window.location对象
        // fragment是需要更新的hash串
        // 如果需要将新的hash替换到当前URL, 可以设置replace为true
        _updateHash : function(location, fragment, replace) {
            // 如果设置了replace为true, 则使用location.replace方法替换当前的URL
            // 使用replace方法替换URL后, 新的URL将占有原有URL在history历史中的位置
            if(replace) {
                // 将当前URL与hash组合为一个完整的URL并替换
                location.replace(location.toString().replace(/(javascript:|#).*$/, '') + '#' + fragment);
            } else {
                // 没有使用替换方式, 直接设置location.hash为新的hash串
                location.hash = fragment;
            }
        }
    });

    // Backbone.View 视图相关
    // -------------

    // 视图类用于创建与数据低耦合的界面控制对象, 通过将视图的渲染方法绑定到数据模型的change事件, 当数据发生变化时会通知视图进行渲染
    // 视图对象中的el用于存储当前视图所需要操作的DOM最父层元素, 这主要是为了提高元素的查找和操作效率, 其优点包括:
    // - 查找或操作元素时, 将操作的范围限定在el元素内, 不需要再整个文档树中搜索
    // - 在为元素绑定事件时, 可以方便地将事件绑定到el元素(默认也会绑定到el元素)或者是其子元素
    // - 在设计模式中, 将一个视图相关的元素, 事件, 和逻辑限定在该视图的范围中, 降低视图与视图间的耦合(至少在逻辑上是这样)
    var View = Backbone.View = function(options) {
        // 为每一个视图对象创建一个唯一标识, 前缀为"view"
        this.cid = _.uniqueId('view');
        // 设置初始化配置
        this._configure(options || {});
        // 设置或创建视图中的元素
        this._ensureElement();
        // 调用自定义的初始化方法
        this.initialize.apply(this, arguments);
        // 解析options中设置的events事件列表, 并将事件绑定到视图中的元素
        this.delegateEvents();
    };
    // 定义用于解析events参数中事件名称和元素的正则
    var delegateEventSplitter = /^(\S+)\s*(.*)$/;

    // viewOptions列表记录一些列属性名, 在构造视图对象时, 如果传递的配置项中包含这些名称, 则将属性复制到对象本身
    var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName'];

    // 向视图类的原型对象中添加一些方法
    _.extend(View.prototype, Events, {

        // 如果在创建视图对象时, 没有设置指定的el元素, 则会通过make方法创建一个元素, tagName为创建元素的默认标签
        // 也可以通过在options中自定义tagName来覆盖默认的"div"标签
        tagName : 'div',

        // 每个视图中都具有一个$选择器方法, 该方法与jQuery或Zepto类似, 通过传递一个表达式来获取元素
        // 但该方法只会在视图对象的$el元素范围内进行查找, 因此会提高匹配效率
        $ : function(selector) {
            return this.$el.find(selector);
        },
        // 初始化方法, 在对象被实例化后自动调用
        initialize : function() {
        },
        // render方法与initialize方法类似, 默认没有实现任何逻辑
        // 一般会重载该方法, 以实现对视图中元素的渲染
        render : function() {
            // 返回当前视图对象, 以支持方法的链式操作
            // 因此如果重载了该方法, 建议在方法最后也返回视图对象(this)
            return this;
        },
        // 移除当前视图的$el元素
        remove : function() {
            // 通过调用jQuery或Zepto的remove方法, 因此在第三方库中会同时移除该元素绑定的所有事件和数据
            this.$el.remove();
            return this;
        },
        // 根据传入的标签名称, 属性和内容, 创建并返回一个DOM元素
        // 该方法用于在内部创建this.el时自动调用
        make : function(tagName, attributes, content) {
            // 根据tagName创建元素
            var el = document.createElement(tagName);
            // 设置元素属性
            if(attributes)
                $(el).attr(attributes);
            // 设置元素内容
            if(content)
                $(el).html(content);
            // 返回元素
            return el;
        },
        // 为视图对象设置标准的$el及el属性, 该方法在对象创建时被自动调用
        // $el是通过jQuery或Zepto创建的对象, el是标准的DOM对象
        setElement : function(element, delegate) {
            // 如果已经存在了$el属性(可能是手动调用了setElement方法切换视图的元素), 则取消之前对$el绑定的events事件(详细参考undelegateEvents方法)
            if(this.$el)
                this.undelegateEvents();
            // 将元素创建为jQuery或Zepto对象, 并存放在$el属性中
            this.$el = ( element instanceof $) ? element : $(element);
            // this.el存放标准的DOM对象
            this.el = this.$el[0];
            // 如果设置了delegate参数, 则为元素绑定视图中events参数设置的事件
            // 在视图类的构造函数中, 已经调用了delegateEvents方法进行绑定, 因此在初始化的_ensureElement方法中调用setElement方法时没有传递delegate参数
            // 在手动调用setElemen方法设置视图元素时, 允许传递delegate绑定事件
            if(delegate !== false)
                this.delegateEvents();
            return this;
        },
        // 为视图元素绑定事件
        // events参数配置了需要绑定事件的集合, 格式如('事件名称 元素选择表达式' : '事件方法名称/或事件函数'):
        // {
        //     'click #title': 'edit',
        //     'click .save': 'save'
        //     'click span': function() {}
        // }
        // 该方法在视图对象初始化时会被自动调用, 并将对象中的events属性作为events参数(事件集合)
        delegateEvents : function(events) {
            // 如果没有手动传递events参数, 则从视图对象获取events属性作为事件集合
            if(!(events || ( events = getValue(this, 'events'))))
                return;
            // 取消当前已经绑定过的events事件
            this.undelegateEvents();
            // 遍历需要绑定的事件列表
            for(var key in events) {
                // 获取需要绑定的方法(允许是方法名称或函数)
                var method = events[key];
                // 如果是方法名称, 则从对象中获取该函数对象, 因此该方法名称必须是视图对象中已定义的方法
                if(!_.isFunction(method))
                    method = this[events[key]];
                // 对无效的方法抛出一个错误
                if(!method)
                    throw new Error('Method "' + events[key] + '" does not exist');
                // 解析事件表达式(key), 从表达式中解析出事件的名字和需要操作的元素
                // 例如 'click #title'将被解析为 'click' 和 '#title' 两部分, 均存放在match数组中
                var match = key.match(delegateEventSplitter);
                // eventName为解析后的事件名称
                // selector为解析后的事件元素选择器表达式
                var eventName = match[1], selector = match[2];
                // bind方法是Underscore中用于绑定函数上下文的方法
                // 这里将method事件方法的上下文绑定到当前视图对象, 因此在事件被触发后, 事件方法中的this始终指向视图对象本身
                method = _.bind(method, this);
                // 设置事件名称, 在事件名称后追加标识, 用于传递给jQuery或Zepto的事件绑定方法
                eventName += '.delegateEvents' + this.cid;
                // 通过jQuery或Zepto绑定事件
                if(selector === '') {
                    // 如果没有设置子元素选择器, 则通过bind方法将事件和方法绑定到当前$el元素本身
                    this.$el.bind(eventName, method);
                } else {
                    // 如果当前设置了子元素选择器表达式, 则通过delegate方式绑定
                    // 该方法将查找当前$el元素下的子元素, 并将于selector表达式匹配的元素进行事件绑定
                    // 如果该选择器的元素不属于当前$el的子元素, 则事件绑定无效
                    this.$el.delegate(selector, eventName, method);
                }
            }
        },
        // 取消视图中当前元素绑定的events事件, 该方法一般不会被使用
        // 除非调用delegateEvents方法重新为视图中的元素绑定事件, 在重新绑定之前会清除当前的事件
        // 或通过setElement方法重新设置试图的el元素, 也会清除当前元素的事件
        undelegateEvents : function() {
            this.$el.unbind('.delegateEvents' + this.cid);
        },
        // 在实例化视图对象时设置初始配置
        // 将传递的配置覆盖到对象的options中
        // 将配置中与viewOptions列表相同的配置复制到对象本身, 作为对象的属性
        _configure : function(options) {
            // 如果对象本身设置了默认配置, 则使用传递的配置进行合并
            if(this.options)
                options = _.extend({}, this.options, options);
            // 遍历viewOptions列表
            for(var i = 0, l = viewOptions.length; i < l; i++) {
                // attr依次为viewOptions中的属性名
                var attr = viewOptions[i];
                // 将options配置中与viewOptions相同的配置复制到对象本身, 作为对象的属性
                if(options[attr])
                    this[attr] = options[attr];
            }
            // 设置对象的options配置
            this.options = options;
        },
        // 每一个视图对象都应该有一个el元素, 作为渲染的元素
        // 在构造视图时, 可以设置对象的el属性来指定一个元素
        // 如果设置的el是一个字符串或DOM对象, 则通过$方法将其创建为一个jQuery或Zepto对象
        // 如果没有设置el属性, 则根据传递的tagName, id和className, 调用mak方法创建一个元素
        // (新创建的元素不会被添加到文档树中, 而始终存储在内存, 当处理完毕需要渲染到页面时, 一般会在重写的render方法, 或自定义方法中, 访问this.el将其追加到文档)
        // (如果我们需要向页面添加一个目前还没有的元素, 并且需要为其添加一些子元素, 属性, 样式或事件时, 可以通过该方式先将元素创建到内存, 在完成所有操作之后再手动渲染到文档, 可以提高渲染效率)
        _ensureElement : function() {
            // 如果没有设置el属性, 则创建默认元素
            if(!this.el) {
                // 从对象获取attributes属性, 作为新创建元素的默认属性列表
                var attrs = getValue(this, 'attributes') || {};
                // 设置新元素的id
                if(this.id)
                    attrs.id = this.id;
                // 设置新元素的class
                if(this.className)
                    attrs['class'] = this.className;
                // 通过make方法创建元素, 并调用setElement方法将元素设置为视图所使用的标准元素
                this.setElement(this.make(this.tagName, attrs), false);
            } else {
                // 如果设置了el属性, 则直接调用setElement方法将el元素设置为视图的标准元素
                this.setElement(this.el, false);
            }
        }
    });

    // 实现对象继承的函数, 该函数内部使用inherits实现继承, 请参考inherits函数
    var extend = function(protoProps, classProps) {
        // child存储已经实现继承自当前类的子类(Function)
        // protoProps设置子类原型链中的属性
        // classProps设置子类的静态属性
        var child = inherits(this, protoProps, classProps);
        // 将extend函数添加到子类, 因此调用子类的extend方法便可实现对子类的继承
        child.extend = this.extend;
        // 返回实现继承的子类
        return child;
    };
    // 为Model, Collection, Router和View类实现继承机制
    Model.extend = Collection.extend = Router.extend = View.extend = extend;

    // Backbone.sync 与服务器异步交互相关
    // -------------

    // 定义Backbone中与服务器交互方法和请求type的对应关系
    var methodMap = {
        'create' : 'POST',
        'update' : 'PUT',
        'delete' : 'DELETE',
        'read' : 'GET'
    };

    // sync用于在Backbone中操作数据时, 向服务器发送请求同步数据状态, 以建立与服务器之间的无缝连接
    // sync发送默认通过第三方库(jQuery, Zepto等) $.ajax方法发送请求, 因此如果要调用状态同步相关的方法, 需要第三方库支持
    // Backbone默认定义了一套与服务器交互的数据格式(JSON)和结构, 服务器响应的数据应该遵循该约定
    // 如果数据不需要保存在服务器, 或与服务器交互方法, 数据格式结构与约定不一致, 可以通过重载sync方法实现
    // @param {String} method 在Backbone中执行的CRUD操作名称
    // @param {Model Obejct} model 需要与服务器同步状态的模型对象
    // @param {Object} options
    Backbone.sync = function(method, model, options) {
        // 根据CRUD方法名定义与服务器交互的方法(POST, GET, PUT, DELETE)
        var type = methodMap[method];

        // options默认为一个空对象
        options || ( options = {});

        // params将作为请求参数对象传递给第三方库的$.ajax方法
        var params = {
            // 请求类型
            type : type,
            // 数据格式默认为json
            dataType : 'json'
        };

        // 如果在发送请求时没有在options中设置url地址, 将会通过模型对象的url属性或方法来获取url
        // 模型所获取url的方式可参考模型的url方法
        if(!options.url) {
            // 获取请求地址失败时会调用urlError方法抛出一个错误
            params.url = getValue(model, 'url') || urlError();
        }

        // 如果调用create和update方法, 且没有在options中定义请求数据, 将序列化模型中的数据对象传递给服务器
        if(!options.data && model && (method == 'create' || method == 'update')) {
            // 定义请求的Content-Type头, 默认为application/json
            params.contentType = 'application/json';
            // 序列化模型中的数据, 并作为请求数据传递给服务器
            params.data = JSON.stringify(model.toJSON());
        }

        // 对于不支持application/json编码的浏览器, 可以通过设置Backbone.emulateJSON参数为true实现兼容
        if(Backbone.emulateJSON) {
            // 不支持Backbone.emulateJSON编码的浏览器, 将类型设置为application/x-www-form-urlencoded
            params.contentType = 'application/x-www-form-urlencoded';
            // 将需要同步的数据存放在key为"model"参数中发送到服务器
            params.data = params.data ? {
                model : params.data
            } : {};
        }

        // 对于不支持REST方式的浏览器, 可以设置Backbone.emulateHTTP参数为true, 以POST方式发送数据, 并在数据中加入_method参数标识操作名称
        // 同时也将发送X-HTTP-Method-Override头信息
        if(Backbone.emulateHTTP) {
            // 如果操作类型为PUT或DELETE
            if(type === 'PUT' || type === 'DELETE') {
                // 将操作名称存放到_method参数发送到服务器
                if(Backbone.emulateJSON)
                    params.data._method = type;
                // 实际以POST方式进行提交, 并发送X-HTTP-Method-Override头信息
                params.type = 'POST';
                params.beforeSend = function(xhr) {
                    xhr.setRequestHeader('X-HTTP-Method-Override', type);
                };
            }
        }

        // 对非GET方式的请求, 将不对数据进行转换, 因为传递的数据可能是一个JSON映射
        if(params.type !== 'GET' && !Backbone.emulateJSON) {
            // 通过设置processData为false来关闭数据转换
            // processData参数是$.ajax方法中的配置参数, 详细信息可参考jQuery或Zepto相关文档
            params.processData = false;
        }

        // 通过第三方库的$.ajax方法向服务器发送请求同步数据状态
        // 传递给$.ajax方法的参数使用extend方法将options对象中的参数覆盖到了params对象, 因此在调用sync方法时设置了与params同名的options参数, 将以options为准
        return $.ajax(_.extend(params, options));
    };
    // 包装一个统一的模型错误处理方法, 会在模型与服务器交互发生错误时被调用
    // onError是在调用与服务器的交互方法时(如fetch, destory等), options中指定的自定义错误处理函数
    // originalModel是发生错误的模型或集合对象
    Backbone.wrapError = function(onError, originalModel, options) {
        return function(model, resp) {
            resp = model === originalModel ? resp : model;

            if(onError) {
                // 如果设置了自定义错误处理方法, 则调用自定义方法
                onError(originalModel, resp, options);
            } else {
                // 默认将触发发生错误的模型或集合的error事件
                originalModel.trigger('error', originalModel, resp, options);
            }
        };
    };
    // Helpers 定义一些供Backbone内部使用的帮助函数
    // -------

    // ctor是一个共享的空函数, 用于在调用inherits方法实现继承时, 承载父类的原型链以便设置到子类原型中
    var ctor = function() {
    };
    // 实现OOP继承特性
    // @param {Function} parent 被继承的父类Function
    // @param {Object} protoProps 扩展子类原型中的属性(或方法)对象
    // @param {Object} staticProps 扩展子类的静态属性(或方法)对象
    var inherits = function(parent, protoProps, staticProps) {
        var child;

        // 如果在protoProps中指定了"constructor"属性, 则"constructor"属性被作为子类的构造函数
        // 如果没有指定构造子类构造函数, 则默认调用父类的构造函数
        if(protoProps && protoProps.hasOwnProperty('constructor')) {
            // 使用"constructor"属性指定的子类构造函数
            child = protoProps.constructor;
        } else {
            // 使用父类的构造函数
            child = function() {
                parent.apply(this, arguments);
            };
        }

        // 将父类中的静态属性复制为子类静态属性
        _.extend(child, parent);

        // 将父类原型链设置到子类的原型对象中, 子类以此继承父类原型链中的所有属性
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();

        // 将protoProps对象中的属性复制到子类的原型对象, 子类以此拥有protoProps中的属性
        if(protoProps)
            _.extend(child.prototype, protoProps);

        // 将staticProps对象中的属性复制到子类的构造函数本身, 将staticProps中的属性作为子类的静态属性
        if(staticProps)
            _.extend(child, staticProps);

        // 在复制父类原型链到子类原型时, 子类原型链中的构造函数已经被覆盖, 因此此处重新设置子类的构造函数
        child.prototype.constructor = child;

        // 如果子类设置了constructor属性, 则子类构造函数为constructor指定的函数
        // 如果需要在子类构造函数中调用父类构造函数, 则需要在子类构造函数中手动调用父类的构造函数
        // 此处将子类的__super__属性指向父类的构造函数, 方便在子类中调用: 子类.__super__.constructor.call(this);
        child.__super__ = parent.prototype;

        // 返回子类
        return child;
    };
    // 获取对象prop属性的值, 如果prop属性是一个函数, 则执行并返回该函数的返回值
    var getValue = function(object, prop) {
        // 如果object为空或object不存在prop属性, 则返回null
        if(!(object && object[prop]))
            return null;
        // 返回prop属性值, 如果prop是一个函数, 则执行并返回该函数的返回值
        return _.isFunction(object[prop]) ? object[prop]() : object[prop];
    };
    // 抛出一个Error异常, 在Backbone内部会频繁执行, 因此独立为一个公共函数
    var urlError = function() {
        throw new Error('A "url" property or function must be specified');
    };
}).call(this);
