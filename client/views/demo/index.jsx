import React from 'react';
import {connect} from 'dva';
import cn from 'classnames';
import {hot} from 'react-hot-loader';
import {Affix, Button, Icon, Form, Select} from 'antd';
import {GContainer, GHeader, GPage} from 'client/components/GLayout';
import Upload from 'client/components/Upload';
import AjaxMap from 'client/services/public';
import Payment from 'client/components/Payment';
import SelfSelect from 'client/components/Select';

import './style.less';

const FormItem = Form.Item;
const Option = Select.Option;
class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  // componentWillReceiveProps(){
  // }

  render() {
    const {global, form} = this.props;
    const { getFieldDecorator, validateFields } = form;

    const getSelectValue = () => {
      validateFields(['self_select'], (err, value) => {
        console.log(value);
      });
    };

    return (<GContainer className={cn('home-view')}>
      <GHeader
        route={[
          {name: '首页', path: `/${window.__themeKey}/dashboard`},
          {name: '当前页面'},
        ]}
      />

      <GPage>
        <div style={{height: 72}}>
          <Affix offsetTop={46 + 46}>
            <div style={{width: '100%'}}>顶部内容</div>
          </Affix>
        </div>

        {/*由antd 的 Upload 组件拓展 antd 支持的属性都支持 不过文件路径是 url*/}
        {/*renderLoading = (percent) => ReactNode 自定义上传中loading组件 (percent上传进度百分比)  默认= false 不显示*/}
        {/*type = image || doc type的快捷区分上传类型传入参数 默认 image*/}
        {/*compress = true 开启图片压缩 上传 excel 不要开启 默认 false*/}
        {/*suffix 后缀数组 ['xlsx']*/}
        {/*max = 1 最大支持多少文件上传*/}
        {/*onCancel 取消文件上传后的回调*/}
        <Upload
          type={'image'}
          compress
          onComplete={(data) => {
            //上传完成后的回调
            console.log(data);
          }}
        >
          <Button><Icon type="upload"/> 点击上传图片1</Button>
        </Upload>

        {/*excel 目前看到有3个url 自行在此 AjaxMap 中查询 */}
        <Upload
          type={'doc'}
          url={AjaxMap.getUploadData.url}
          name={'file'}
          suffix={['xlsx']}
          data={{companyId: global.account.companyId}} //ok
          onCancel={(delFile, fileList) => {
            console.log('删除的文件', delFile);
            console.log('当前列表', fileList);
          }}
          onComplete={(data) => {
            //上传完成后的回调
            console.log(data);
          }}
        >
          <Button><Icon type="upload"/> 点击上传文件</Button>
        </Upload>

        {/*个性化上传*/}
        <Upload
          renderLoading={percent => <Button><Icon type="loading"/> {percent}%</Button>}
          showUploadList={false}
          type={'image'}
          compress
          onComplete={(data) => {
            //上传完成后的回调
            console.log(data);
          }}
        >
          <Button><Icon type="upload"/> <span style={{color: 'red'}}>点击体验个性化上传组件（图片）</span></Button>
        </Upload>

        <Button
          onClick={() => {
            this.paymentDialog.showPayment();
          }}
        >我要充值</Button>

        {/*dialog 表示 弹框韩式嵌入块， money表示直接设置金额不会再调用输入*/}
        <Payment
          ref={e => (this.paymentDialog = e)}
          show={false}
          money={1}
          callback={(opt, next) => {
            console.log(opt, next, 'opt, next');
            const {type, money, water} = opt;
            switch (type) {
              case 'alipay':
                next('123123123');
                break;
              case 'wx':
                next('saudlamsklkgas;ldl;askdl;aksld;nasdblkajsk');
                break;
              case 'bank':
                next();
                break;
              case 'pay':
                next('url');
                break;
            }
          }}
          onComplete={(type) => {
            console.log(type, '完成');
          }}
        />

        {/*新版block类型*/}
        <div style={{padding: 30}}>
          <Payment
            ref={e => (this.paymentBlock = e)}
            show
            dialog={false}
            block={2}
            money={'1'}
            dredge={{alipay: true, wx: false, pay: true, bank: false}}
            query={{
              moneyId: global.account.companyId, //ok
              outTradeNo: '123456',
            }}
            callback={(opt, next) => {
              const {type, money, water} = opt;
              console.log(money);
              switch (type) {
                case 'alipay':
                  next('http://www.baidu.com');
                  break;
                case 'wx':
                  next('saudlamsklkgas;ldl;askdl;aksld;nasdblkajsk');
                  break;
                case 'bank':
                  next();
                  break;
                case 'pay':
                  next('http://www.baidu.com');
                  break;
              }
            }}
            onComplete={(type) => {
              console.log(type, '完成');
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  console.log(type, '关闭');
                  resolve();
                }, 1000);
              });
            }}
          />
        </div>

        <Payment
          ref={e => (this.paymentBlock = e)}
          show
          dialog={false}
          money={'1'}
          callback={(opt, next) => {
            const {type, money, water} = opt;
            console.log(money);
            switch (type) {
              case 'alipay':
                next('http://www.baidu.com');
                break;
              case 'wx':
                next('saudlamsklkgas;ldl;askdl;aksld;nasdblkajsk');
                break;
              case 'bank':
                next();
                break;
              case 'pay':
                next('http://www.baidu.com');
                break;
            }
          }}
          onComplete={(type) => {
            console.log(type, '完成');
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                console.log(type, '关闭');
                resolve();
              }, 1000);
            });
          }}
        />

        <Button
          onClick={() => {
            this.paymentBlock.paymentBlockNext();
          }}
        >立即支付</Button>


        <span style={{color: 'var(--default-color)'}}>
          页面内容
        </span>

        <Form>
          <FormItem>
            {getFieldDecorator('self_select', {
              initialValue: '',
            })(
              <SelfSelect style={{width: '180px'}} placeholder="12312">
                <Option key="1" value="1">hello</Option>
                <Option key="2" value="2">world</Option>
              </SelfSelect>
            )}
          </FormItem>
        </Form>
        <Button type="primary" onClick={getSelectValue}>获取 select 的值</Button>
        <div style={{padding: '20px'}}>我是有滚动条的</div>
        <div style={{padding: '20px'}}>我是有滚动条的</div>
        <div style={{padding: '20px'}}>我是有滚动条的</div>
        <div style={{padding: '20px'}}>我是有滚动条的</div>
        <div style={{padding: '20px'}}>我是有滚动条的</div>
        <div style={{padding: '20px'}}>我是有滚动条的</div>
        <div style={{padding: '20px'}}>我是有滚动条的</div>
        <div style={{padding: '20px'}}>我是有滚动条的</div>
        <div style={{padding: '20px'}}>我是有滚动条的</div>
        <div style={{padding: '20px'}}>我是有滚动条的</div>
        <div style={{padding: '20px'}}>我是有滚动条的</div>
        <div style={{padding: '20px'}}>我是有滚动条的</div>
        <div style={{padding: '20px'}}>我是有滚动条的</div>
        <div style={{padding: '20px'}}>我是有滚动条的</div>
        <div style={{padding: '20px'}}>我是有滚动条的</div>
        <div style={{padding: '20px'}}>我是有滚动条的</div>
        <div style={{padding: '20px'}}>我是有滚动条的</div>
        <div style={{padding: '20px'}}>我是有滚动条的</div>
        <div style={{padding: '20px'}}>我是有滚动条的</div>
        <div style={{padding: '20px'}}>我是有滚动条的</div>
        <div style={{padding: '20px'}}>我是有滚动条的</div>
        <div style={{padding: '20px'}}>我是有滚动条的</div>
        <div style={{padding: '20px'}}>我是有滚动条的</div>
        <div style={{padding: '20px'}}>我是有滚动条的</div>
        <div style={{padding: '20px'}}>我是有滚动条的</div>
        <div style={{padding: '20px'}}>我是有滚动条的</div>
        <div style={{padding: '20px'}}>我是有滚动条的</div>
        <div style={{padding: '20px'}}>我是有滚动条的</div>
        <div style={{padding: '20px'}}>我是有滚动条的</div>


        <Affix offsetBottom={26}>
          <div style={{width: '100%'}}>底部内容</div>
        </Affix>
      </GPage>

    </GContainer>);
  }
}

export default connect(state => state)(Form.create()(hot(module)(Class)));
