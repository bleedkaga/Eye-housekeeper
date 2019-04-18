import React from 'react';
import {Upload, Icon, message, Button} from 'antd';
import {instance} from 'client/utils/ajax';
import AjaxMap from 'client/services/public';

import Compress from './compress';

const defaultImageSuffix = ['jpg', 'jpeg', 'png'];
const defaultEXSuffix = ['xlsx'];

class Class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: false,
      percent: 0,
    };
  }

  static defaultProps = {
    suffix: undefined,
    fileList: [],
    max: 1, //最大上传多少个文件
    renderLoading: false,
    size: 5 * 1024, // 1024KB
    type: 'image', //快捷选择上传类型
    compress: false, //是否开启图片压缩
    quality: 0.8, //图片压缩开启后的图片导出质量
    width: 1024, //图片压缩开启后的图片导出最大宽高
  };

  isDelete = false;

  componentDidMount() {
  }


  onChange = (e) => {
    const {max, fileList} = this.props;
    let list = e.fileList || [];
    list = list.reverse();
    if (list.length > max) {
      list.length = max;
    }
    list = list.reverse();
    fileList.length = list.length;
    list.forEach((item, index) => (fileList[index] = item));
    const {onChange, onCancel} = this.props;
    if (this.isDelete) {
      onCancel && onCancel(this.isDelete, fileList);
      this.isDelete = false;
    }

    onChange && onChange(e);
  };

  onRemove = (file) => {
    const {onRemove} = this.props;
    this.isDelete = file;

    if (onRemove) {
      return onRemove(file);
    }
  };

  _customRequest = (e) => {
    this.setState({disabled: true});
    const {compress, onComplete, data, type} = this.props;
    let {url} = this.props;

    url = url || (type === 'image' ? AjaxMap.uploadImage.url : '');

    const {
      file,
      filename,
      headers,
      onError,
      onProgress,
      onSuccess,
      withCredentials,
    } = e;
    const formData = new FormData();
    if (data) {
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
    }
    compress && file.compressFile ? formData.append(filename, file.compressFile) : formData.append(filename, file);

    instance.post(url, formData, {
      withCredentials,
      headers,
      onUploadProgress: ({total, loaded}) => {
        const r = Math.round(loaded / total * 100).toFixed(0);
        onProgress({percent: r >= 100 ? 99 : r}, file);
        this.setState({percent: r >= 100 ? 99 : r});
      },
    }).then(({data: response}) => {
      onSuccess(response, file);
      onComplete && onComplete(response, file, this.props.fileList);
      this.setState({disabled: false});
      if (response.code !== 0) {
        onError(new Error(response.message));
        message.error(response.message);
      }
    }).catch((err) => {
      this.setState({disabled: false});
      onError(err);
      message.error(`${file.name}上传失败`);
    });
  };

  _beforeUpload = (file, files) => {
    const {size, compress, quality, width, type} = this.props;
    let {suffix} = this.props;
    suffix = suffix || (type === 'image' ? defaultImageSuffix : defaultEXSuffix);
    const s = this.getSuffix(file.name);

    if (suffix.indexOf(s.toLowerCase()) !== -1 || suffix.indexOf(s.toUpperCase()) !== -1) {
      file.suffix = s.toLowerCase();
      if (compress) {
        //图片压缩
        return new Promise((resolve, reject) => {
          Compress.init({
            file,
            quality,
            width,
            suffix: file.suffix,
          }).then((newFile) => {
            if (size === 0 || newFile.size < size * 1024) {
              file.compressFile = newFile;
              resolve();
            } else {
              reject();
              message.warn(`您选择的文件太大，最大支持${this.getSizeText()}的文件上传`);
            }
          }).catch(reject);
          return true;
        });
      } else if (size === 0 || file.size < size * 1024) {
        return true;
      } else {
        message.warn(`您选择的文件太大，最大支持${this.getSizeText()}的文件上传`);
      }
    } else {
      message.warn(`您选择的文件不支持，只支持${suffix.join('、')}的文件上传`);
    }
    this.removeFileByUID(files, file.uid);
    return false;
  };

  getSizeText() {
    const {size} = this.props;
    const t = size * 1024; //KB
    if (t >= 1024 * 1024) {
      return `${(t / (1024 * 1024)).toFixed(1)}MB`;
    }
    return `${size}KB`;
  }

  getSuffix(name) {
    const temp = name.split('.');
    return temp.pop().toString();
  }

  renderLoading(percent) {
    return <Button disabled className={'g-upload-loading'}><Icon type="loading"/><span>{percent}%</span></Button>;
  }

  findFileByUID(files, uid) {
    return files.findIndex(item => item.uid === uid);
  }

  removeFileByUID(files, uid) {
    const index = this.findFileByUID(files, uid);
    if (index !== -1) files.splice(index, 1);
  }

  render() {
    const {children, renderLoading} = this.props;
    const {disabled, percent} = this.state;

    return (<Upload
      {...this.props}
      ref={e => (this._upload = e)}
      disabled={disabled}
      onChange={this.onChange}
      onRemove={this.onRemove}
      beforeUpload={this._beforeUpload}
      customRequest={this._customRequest}
    >
      {
        disabled && renderLoading !== false ? renderLoading ? renderLoading(percent) : this.renderLoading(percent) : children
      }
    </Upload>);
  }
}

export default Class;
