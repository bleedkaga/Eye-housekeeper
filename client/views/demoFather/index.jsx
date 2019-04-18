import React from 'react';
import {connect} from 'dva';
import {Switch} from 'dva/router';
import {renderRoutes} from 'react-router-config';
import {hot} from 'react-hot-loader';

// import Tools from 'client/utils/tools';
// import RH from 'client/routeHelper';


import './style.less';


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
    /*
    这里的渲染其实就是这个样子
    这里灵活多变可以根据自己需要进行修改
    <Switch>
       <Route path={'/url1'} component={Component1}/>
       <Route path={'/url2'} component={Component2}/>
    </Switch>
     */
    return (<Switch>
      {
        renderRoutes(this.props.route.routes)
      }
    </Switch>);
  }
}

export default connect(state => state)(hot(module)(Class));
