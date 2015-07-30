//相关验证
jQuery.validator.addMethod("telphoneValid", function(value, element) { 
    var tel = /^0?(13[0-9]|15[012356789]|18[01236789]|14[57])[0-9]{8}$/g; 
    return tel.test(value) || this.optional(element); 
}, '请填写正确的手机号码');
jQuery.validator.addMethod("defaultValid", function(value, element) {
    return !(element.value == element.defaultValue);
}, jQuery.validator.messages.required);
$(function(){
    $("#person").validate({
       rules: {  
          username: {  
             required: true,  
             minlength: 4  
          },
          birth: {
            required: true
          },
          prov: {
            min:1
          },
          city: {
            min:1
          },
          place:{
            min:1
          },
          real_name:{
            required: false
          },
          mobile_phone:{
            required: false,
            telphoneValid: true,
            digits: true
          },
          address:{
            required: false
          },
          old_pwd:{
            required: true
          },
          new_pwd:{
            required: true,
            minlength: 4
          },
          confirm_new_pwd:{
            required: true,
            equalTo: '#new_pwd'
          },
          e_mail:{
            required: true,
            email: true
          },
          photo:{
            required: true,
            defaultValid: true
          }
       },  
       messages: {  
          username: {  
             required: '请填写昵称',  
             minlength: '请至少输入4个字符'  
          },
          birth: {
            required: '请填写出生日期'
          },
          prov:{
            min:'请选择省份'
          },
          city:{
            min:'请选择城市'
          },
          place:{
            min:'请选择地区'
          },
          real_name:{
            required: '请填写你的真实姓名'
          },
          mobile_phone:{
            required: '请填写你的手机号码',
            digits: true
          },
          address:{
            required: '请填写你的真实地址'
          },
          old_pwd:{
            required: '请填写你的当前密码'
          },
          new_pwd:{
            required: '请填写你的新密码',
            minlength: '密码长度4-16个字符'
          },
          confirm_new_pwd:{
            required: '请再一次填写你的新密码',
            equalTo: '两次输入的密码不一致'
          },
          e_mail:{
            required: '请填写正确的邮箱地址',
            email: '请填写正确的邮箱地址'
          },
          photo:{
            required: '请填写相册名称',
            defaultValid: '请填写相册名称'
          }
       } 
    });

    $("#phone_form").validate({
        rules: {
            mobile_phone:{
                required: true,
                telphoneValid: true,
                digits: true
              }
        },
        messages: {
            mobile_phone:{
                required: '请填写你的手机号码',
                digits: true
          }
        }
    });
    //管理我的患者信息
    $('#mypatient input[name=name]').focusout(function(){
        if($.trim($(this).val()) === ''){
            $(this).valid();
        }
    });
    $('#mypatient input[name=phone]').focusout(function(){
        if($.trim($(this).val()) === ''){
            $(this).valid();
        }
    });
    $("#mypatient").validate({
        rules: {
            name:{
                required: false
            },
            phone:{
                required: true,
                telphoneValid: true,
                digits: true
            }
        },
        messages: {
            name:{
                required: '请填写你的真实姓名'
            },
            phone:{
                required: '请填写你的手机号码',
                digits: true
          }
        }
    });
})