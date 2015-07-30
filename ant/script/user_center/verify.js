//�����֤
jQuery.validator.addMethod("telphoneValid", function(value, element) { 
    var tel = /^0?(13[0-9]|15[012356789]|18[01236789]|14[57])[0-9]{8}$/g; 
    return tel.test(value) || this.optional(element); 
}, '����д��ȷ���ֻ�����');
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
             required: '����д�ǳ�',  
             minlength: '����������4���ַ�'  
          },
          birth: {
            required: '����д��������'
          },
          prov:{
            min:'��ѡ��ʡ��'
          },
          city:{
            min:'��ѡ�����'
          },
          place:{
            min:'��ѡ�����'
          },
          real_name:{
            required: '����д�����ʵ����'
          },
          mobile_phone:{
            required: '����д����ֻ�����',
            digits: true
          },
          address:{
            required: '����д�����ʵ��ַ'
          },
          old_pwd:{
            required: '����д��ĵ�ǰ����'
          },
          new_pwd:{
            required: '����д���������',
            minlength: '���볤��4-16���ַ�'
          },
          confirm_new_pwd:{
            required: '����һ����д���������',
            equalTo: '������������벻һ��'
          },
          e_mail:{
            required: '����д��ȷ�������ַ',
            email: '����д��ȷ�������ַ'
          },
          photo:{
            required: '����д�������',
            defaultValid: '����д�������'
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
                required: '����д����ֻ�����',
                digits: true
          }
        }
    });
    //�����ҵĻ�����Ϣ
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
                required: '����д�����ʵ����'
            },
            phone:{
                required: '����д����ֻ�����',
                digits: true
          }
        }
    });
})