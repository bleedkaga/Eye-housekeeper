import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Button, Icon} from 'antd';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';
import File, {SendUpload} from 'client/components/File';
import AjaxMap from 'client/services/public';
import GTitle from 'client/components/GTitle';
import List from './list';
import {goBack} from 'client/routeHelper';

import './style.less';

class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      file: null,
      size: '',
      uploadLoad: false,
    };
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({type: 'importStaff/getDownloadTemplate', payload: {__autoLoading: true}});
    this.onEmpty();
  }

  componentWillUnmount() {
    this.setState({
      file: null,
      size: '',
    });
  }

  // componentWillReceiveProps(){
  // }

  onEmpty() {
    const {dispatch, global} = this.props;
    this.setState({
      file: null,
      size: '',
    });
    return dispatch({
      type: 'importStaff/uploadDataEmpty',
      payload: {
        workerId: global.account.accountId, //ok
        __autoLoading: true,
      },
    });
  }

  onChangeFile(file, size) {
    this.setState({file, size});
  }

  onSendUpload = () => {
    const {global} = this.props;
    const {file} = this.state;
    if (file) {
      const opt = {
        file,
        companyId: global.account.companyId, //ok
        workerId: global.account.accountId, //ok
      };

      if (window.__themeKey === 'union') {
        opt.isGroup = 1;
      }
      this.setState({uploadLoad: true});
      SendUpload(AjaxMap.uploadData.url, opt).then((res) => {
        if (res.code === 0) {
          this.showList();
        }
        this.setState({uploadLoad: false});
      }).catch(() => this.setState({uploadLoad: false}));
    }
  };

  showList() {
    this.setState({show: true});
  }

  hideList() {
    this.setState({show: false});
    this.onEmpty();
  }

  render() {
    const {importStaff, history} = this.props;
    const {file, size, show, uploadLoad} = this.state;

    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '电子档案', path: '/org/hr/staff'},
          {name: '批量导入'},
        ]}
      />

      <GPage className={cn('importStaff')}>
        <GTitle
          onClose={() => {
            show ? this.hideList() : goBack(history);
          }}
        >批量导入成员</GTitle>
        {
          show ? <List
            close={() => this.hideList()}
          /> : <div style={{padding: '50px 84px'}}>
            <div className={cn('tips')}>
              <div className={cn('t1')}>1.批量员工信息导入请下载模板填写。</div>
              <div className={cn('t2')}>2.导入会覆盖原有员工的信息，如需更新已录入的员工信息，请先导出通讯录，在导出表格里进行修改。</div>
              <div className={cn('t3')}>3.子帐号仅能上传和导出子账号管理权限内的通讯录信息。</div>
            </div>
            <div className={cn('step')}>
              <div className={cn('step1', 'step-item')}>
                <i>1</i>
                <div>下载员工通讯录模板，批量填写员工信息</div>
                <a
                  className={cn('btn')}
                  href={importStaff.downloadUrl ? importStaff.downloadUrl : 'javascript:;'}
                  download={importStaff.downloadName}
                >下载模板</a>
              </div>
              <div className={cn('step2', 'step-item')}>
                <i>2</i>
                <div>上传填写好的员工信息表</div>
                <div
                  className={cn('btn')}
                >
                  选择文件
                  <File
                    onComplete={(a, b) => this.onChangeFile(a, b)}
                  />
                </div>
                {
                  file ? <div className={cn('tips-2')}>
                    <div className={cn('file-name')}>
                      <span className={cn('f-toe')}>{file.name}</span>
                      <a href="javascript:" onClick={() => this.setState({file: null, size: ''})}>
                        <Icon type={'close-circle'}/>
                      </a>
                    </div>
                    <em>{size}</em>
                  </div> : <div className={cn('tips-1')}>未选择任何文件</div>
                }

              </div>
            </div>
            <Button
              className={cn('up')}
              type={'primary'}
              disabled={!file}
              onClick={this.onSendUpload}
              loading={uploadLoad}
            >{uploadLoad ? '上传中...' : '上传'}</Button>
          </div>
        }
      </GPage>

    </GContainer>);
  }
}

export default connect(state => state)(hot(module)(Class));
