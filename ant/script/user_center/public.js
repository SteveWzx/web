//ȫѡ/��ѡ
function checkAll(sel, check){
  var obj = $(sel),
      isChecked = $(check).prop('checked'),
      length;
      
  $.each(obj, function(i, o){
    if(!$(o).prop('checked')){
        obj.prop('checked', true);
        length = 1;
    }
     else if(!isChecked){
        length = 0;
     }
     else{
        length = 2;
     }
    });
    obj.click(function(){
        $(this).prop('checked') ? null : $(check).prop('checked', false);
    });
    if((length === 1 || !length) && !isChecked){
        obj.prop('checked', false);
    }
    else if(length === 2 || !length){
        obj.prop('checked', true);
    }
}
//��ҳjs
$(function(){
    
    //�����༭
    var value = '',
        randFn = function(min, max, n){
            var tempArr = [],
                i = 0;
            for(; max >= min; max--){
                tempArr[i++] = max;
            }
            tempArr.sort(function(){
                return 0.5 - Math.random();
            });
            return tempArr.slice(0, n);
        };
        
    //tab�л�
    $('.index-tab').tab();
    
    //��һ��
    $('.gochange').click(function(){
        var container = $(this).parent().next(),
            items = container.children(),
            length = items.length,
            arr,
            nArr,
            fragment = document.createDocumentFragment();
            
       arr = $.makeArray(items);
       nArr = randFn(0, length, 6);
       $.each(nArr, function(i, v){
            $.each(arr, function(k, val){
                if(k === i){
                    $(fragment).append(val);
                }
           });
       });
       container.append(fragment);
    });
    
    //���inputĬ��ֵ
    $('.index-input').checkValue();
    
    //��������
    $('.check-order').bind({
        mouseover: function(){
            $(this).parent().css({zIndex: 2}).siblings('.register-detail').show();
        },
        mouseout: function(){
            $(this).parent().css({zIndex: 0}).siblings('.register-detail').hide();
        }
    });
    //��Ϣ��ʾ
    $('.letter-area > li').bind({
        click: function(event){
            var target = $(event.target);
            if(target.hasClass('msg-detail')){
                target.parent().siblings('.letter-detail').show().parent().css({zIndex: 2}).siblings().css({zIndex: 1});
            }
            else if(target.hasClass('letter-colse')){
                target.parent().parent().hide();
            }
            else if(target.hasClass('letter-m')){
                target.parent().hide();
            }
        }
    });
    //ר��չ��/����
    $('.selectU-off > a').toggle(function(){
        $(this).html('����').parent().addClass('selectU-on').prev().find('ul').height('auto');
    }, function(){
        $(this).html('չ��').parent().removeClass('selectU-on').prev().find('ul').height(22);
    });
})