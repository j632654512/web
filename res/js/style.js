/**
 * Created by Administrator on 2016/7/25 0025.
 */
var dom = "https://dn-kanketest.qbox.me/";
var bucket = "kanketest";
var token = "EyO8s6Vt-jgQOElbuVKh3ukcSc3hkxFdkbGl25Uj:bKoyApVZcQzQLJcx59F3mgQfHPo=:eyJzY29wZSI6ImthbmtldGVzdCIsImRlYWRsaW5lIjoxNDY5NDE2OTgwLCJpbnNlcnRPbmx5IjowLCJkZXRlY3RNaW1lIjowLCJmc2l6ZUxpbWl0IjowfQ==";
var uploadId = "";
var uploadType = new Array();
$(function () {
  UploadFile();
});

//        $.get("url", function(tk){
//            token = tk;
//            UploadFile(tk);
//        });
//文件上传
function UploadFile() {
  var uploader = Qiniu.uploader({
    runtimes: 'html5,flash,html4',    //上传模式,依次退化
    browse_button: 'pickfiles',       //上传选择的点选按钮，**必需**
    uptoken:token,
    //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
    //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
    unique_names: true,
    // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
    // save_key: true,
    // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
    domain: dom,
    bucket: bucket,//下载资源时用到，**必需**
    container: 'container',           //上传区域DOM ID，默认是browser_button的父元素，
    max_file_size: '1mb',           //最大文件体积限制
    flash_swf_url: '/plupload/Moxie.swf',  //引入flash,相对路径
    max_retries: 3,                   //上传失败最大重试次数
    dragdrop: false,                   //开启可拖曳上传
    drop_element: 'container',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
    chunk_size: '2mb',                //分块上传时，每片的体积
    auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
    init: {
      'FilesAdded': function (up, files) {
        plupload.each(files, function (file) {
          // 文件添加进队列后,处理相关的事情
        });
      },
      'BeforeUpload': function (up, file) {
        // 每个文件上传前,处理相关的事情
        ClearPic(uploadId);
        var b = false;
        $.each(uploadType, function (i, data) {
          if (data.Id == uploadId) {
            $("#img_" + data.Id).attr("src", "/img/loading.gif");
            data.Key = file.target_name;
            b = true;
            return true;
          }
        });
        if (!b) {
          var arr = { Id: uploadId, Key: file.target_name };
          uploadType.push(arr);
          $("#img_" + uploadId).attr("src", "/img/loading.gif");
        }
      },
      'UploadProgress': function (up, file) {
        // 每个文件上传时,处理相关的事情
      },
      'FileUploaded': function (up, file, info) {
        $.each(uploadType, function (i, data) {
          if (data.Key == file.target_name) {
            var kk = file.target_name.toLocaleLowerCase();
            var sourceLink = dom + kk;
            $("#img_" + data.Id).attr("src", sourceLink);
            $("#imgkey_" + data.Id).val(kk);
          }
        });
      },
      'Error': function (up, err, errTip) {
        alert(errTip);
        $("#loading").hide();
        //上传出错时,处理相关的事情
      },
      'UploadComplete': function (val) {
        console.log(val.id)
        console.log(val.files[0])
        //队列文件处理完毕后,处理相关的事情
      },
      'Key': function (up, file) {
        console.log(file)
        // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
        // 该配置必须要在 unique_names: false , save_key: false 时才生效
        //var key = "";
        // do something with key here
        //return key
      }
    }
  });
};
function UploadImg(id) {
  uploadId = id;
  $("#spanId").click();
};
function ClearPic(num) {
  $("#img_" + num).attr("src", "/img/add.png");
  $("#imgkey_" + num).val("");
};