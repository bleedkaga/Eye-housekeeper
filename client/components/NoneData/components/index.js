import React from 'react';
import '../style/style.less';

const defConfig = {
  search: {
    icon: 'none-icon-3',
    title: '没有符合筛选条件的影院',
    content: '可以清除筛选条件然后重试',
    text: '立即清除',
  },
  movie: {
    icon: 'none-icon-3',
    title: '没有搜索到影片',
    content: '请稍候后重试',
    text: '',
  },
  address: {
    icon: 'none-icon-4',
    title: '该地区没有放映场次的电影院',
    content: '',
    text: '重新设置地区',
  },

  // internet: {
  //   icon: 'none-icon-0',
  //   title: '链接失败',
  //   content: '别紧张，试试看刷新页面~',
  //   text: '重新加载',
  //   on: empty,
  // },
  // shopping: {
  //   icon: 'none-icon-1',
  //   title: '购物车还是空的',
  //   content: '',
  //   text: '去兑换',
  //   on: empty,
  // },
  // orders: {
  //   icon: 'none-icon-2',
  //   title: '暂无兑换记录',
  //   content: '',
  //   text: '去兑换',
  //   on: empty,
  // },

  piao: {
    icon: 'none-icon-5',
    title: '暂无电影票',
    content: '',
    text: '',
  },
  // news: {
  //   icon: 'none-icon-6',
  //   title: '竟然一条消息都没有',
  //   content: '',
  //   text: '',
  //   on: empty,
  // },
  // logistics: {
  //   icon: 'none-icon-7',
  //   title: '您还没有物流信息~',
  //   content: '',
  //   text: '',
  //   on: empty,
  // },
};

// 选择器组件
class Index extends React.Component {
  constructor(props) {
    super(props);
    const {type} = props;
    const rel = defConfig[type] || {};
    const {title = rel.title, content = rel.content, text = rel.text, on = rel.on, icon = rel.icon} = props;
    this.state = {
      title,
      content,
      text,
      icon,
    };
  }

  componentDidMount() {
    if (this.main) this.main.addEventListener('touchmove', this.preventDefault, false);
  }

  componentWillUnmount() {
    if (this.main) this.main.removeEventListener('touchmove', this.preventDefault, false);
  }

  preventDefault = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  render() {
    const {
      title,
      content,
      text,
      // on,
      icon,
    } = this.state;

    const {style = {}, height, onClick} = this.props;
    if (height !== undefined) {
      height <= 0 ? style.display = 'none' : style.height = height;
    }

    return (
      <div
        ref={el => (this.main = el)}
        className={`none-date-main ${this.props.className || ''}`}
        style={style}
      >
        <div className={'non-date-box'}>
          <div className={`image bg_contain ${icon}`}/>
          <div className={'title'}>{title}</div>
          {
            content && <div className={'content'}>{content}</div>
          }
          {
            text &&
            <a
              onClick={() => onClick && onClick()}
              className={'none-data-btn'}
            >{text}</a>
          }
        </div>
      </div>
    );
  }
}


export default Index;
