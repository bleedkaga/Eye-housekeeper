import React from 'react';
import cn from 'classnames';
import {Modal, TreeSelect, Table} from 'antd';
import MashUpInput from 'client/components/MashUpInput';

import './style.less';

class Class extends React.Component {
  constructor(props) {
    super(props);

    this.tableColumns = [
      {
        title: '姓名',
        key: 'userName',
        dataIndex: 'userName',
        render: text => (text || '-'),
      },
      {
        title: '电话',
        key: 'mobilePhone',
        dataIndex: 'mobilePhone',
        render: text => (text || '-'),
      },
      {
        title: '工作部门',
        key: 'department',
        dataIndex: 'department',
        render: text => (<div className={cn('f-toe')} style={{maxWidth: '175px'}}>{text || '-'}</div>),
      },
      {
        title: '操作',
        key: 'operate',
        dataIndex: 'operate',
        render: (e, item) => {
          if (props.currentPhone && item.mobilePhone === props.currentPhone) {
            return '-';
          } else {
            return (<a onClick={() => this.onOk(item)}>选择</a>);
          }
        },
        width: '20%',
      },
    ];

    this.state = {
      dept: undefined,
      show: !!props.show,
      keyword: '',
      pageIndex: 1,
      isLoad: false,
      list: [],
      total: 0,
      department: [],
    };
  }

  static defaultProps = {
    currentPhone: '',
    placeholder: '请输入姓名查询',
    departmentPlaceholder: '请选择部门',
    title: '选择人员',
    pageSize: 5,
    width: 530,
    onChange: () => {
    },
    getDepartment: () => {
    },
    onOk: () => {
    },
    onCancel: () => {
    },
  };

  componentDidMount() {
    this.onInit();
  }

  componentWillUnmount() {
  }

  onInit() {
    const {getDepartment} = this.props;
    getDepartment && getDepartment((res) => {
      if (res.code === 0) {
        const dept = res.data.dept || [];
        this.setState({
          department: this.getTreeData(dept),
        });
      }
    });
    this.getData();
  }

  onReset() {
    this.setState({
      dept: undefined,
      show: false,
      keyword: '',
      pageIndex: 1,
      isLoad: false,
      list: [],
      total: 0,
      department: [],
    });
  }

  getData() {
    const {onChange} = this.props;
    const {pageIndex, keyword, dept} = this.state;
    this.setState({isLoad: true});
    onChange && onChange(pageIndex, keyword, dept, (res) => {
      if (res.code === 0) {
        this.setState({list: res.data || [], total: res.totalCount || 0});
      }
      this.setState({isLoad: false});
    });
  }

  getTreeData(data) {
    return data.map((item) => {
      if (Array.isArray(item.children) && item.children.length) {
        return {
          title: item.departmentName,
          value: item.id,
          key: item.id,
          children: this.getTreeData(item.children),
        };
      }
      return {
        title: item.departmentName,
        value: item.id,
        key: item.id,
      };
    });
  }

  onShow() {
    this.setState({show: true});
    this.onInit();
  }

  onHide() {
    this.setState({show: false});
    this.onReset();
  }

  onOk(item) {
    const {onOk} = this.props;
    this.onHide();
    onOk && onOk(item);
  }

  onCancel() {
    const {onCancel} = this.props;
    this.onHide();
    onCancel && onCancel();
  }

  onChangeDept = (dept) => {
    this.setState({dept}, () => {
      this.getData();
    });
  };

  render() {
    const {show, keyword, pageIndex, total, list, department, isLoad, dept} = this.state;
    const {title, width, className, pageSize, departmentPlaceholder} = this.props;

    return (<Modal
      destroyOnClose
      className={cn('gsg-modal', 'choose-person-modal', className)}
      title={title}
      width={width}
      visible={show}
      onCancel={() => this.onCancel()}
      footer={null}
    >
      <div className={cn('choose-person-modal-box')}>
        <div className={cn('row')}>
          <div className={cn('col', 'col-60', 'col-center')}>
            <div className={cn('condition-item1', 'row')}>
              <span className={cn('col-center')}>部门：&nbsp;</span>
              <TreeSelect
                allowClear
                className={cn('col', 'col-center')}
                showSearch
                style={{width: '100%'}}
                value={dept}
                dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                treeData={department}
                placeholder={departmentPlaceholder}
                treeDefaultExpandAll
                onChange={this.onChangeDept}
              />
            </div>
          </div>
          <div className={cn('col', 'col-center')}>
            <div className={cn('condition-item')}>
              <MashUpInput
                placeholder={this.props.placeholder}
                value={keyword}
                onChange={(e) => {
                  this.setState({keyword: e.target.value});
                }}
                onSearch={() => {
                  this.setState({pageIndex: 1}, () => {
                    this.getData();
                  });
                }}
                width={'100%'}
                height={34}
              />
            </div>
          </div>
        </div>

        <div className={cn('table-box')}>
          <Table
            columns={this.tableColumns}
            bordered
            size="small"
            loading={isLoad}
            title={() => '查询结果'}
            pagination={{
              pageSizeOptions: ['10', '20', '30', '40', '50'],
              size: 'small',
              showSizeChanger: false,
              showQuickJumper: false,
              onChange: (page) => {
                this.setState({pageIndex: page}, () => {
                  this.getData();
                });
              },
              current: pageIndex,
              pageSize,
              total,
            }}
            dataSource={list}
            rowKey={item => item.id}
          />
        </div>

      </div>
    </Modal>);
  }
}

export default Class;
