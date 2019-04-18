import React from 'react';
import { Input } from 'antd';

export default class RecipientEmailEditable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.recipientEmail,
    };
  }

  render() {
    return (
      <li>
        <span className={'label-name multi'}>完税证明收件箱：</span>
        <div className={'email-edit'}>
          <div className={'input-text'} style={{width: '70%', display: 'inline-block', marginRight: 10}}>
            <Input
              defaultValue={this.props.recipientEmail}
              onChange={(e) => {
                this.setState({
                  value: e.target.value,
                });
              }}
              onPressEnter={() => {
                this.props.onSave(this.state.value);
              }}
            />
          </div>
          <a
            href="javascript:"
            onClick={() => {
              this.props.onSave(this.state.value);
            }}
          >保存</a>
          {
            /* 非首次编辑显示取消 */
            !!this.props.recipientEmail && (<a href="javascript:" onClick={this.props.onCancel}>取消</a>)
          }

        </div>
      </li>

    );
  }
}
