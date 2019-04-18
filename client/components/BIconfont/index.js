import React from 'react';
import cn from 'classnames';

import './BIconfont.less';

const Index = ({type, subType = 'gsg-', colorful = false, className, style}) => {
  if (colorful) {
    return (
      <svg className={cn('colorful-icon', className)} aaa aria-hidden="true">
        <use xlinkHref={`#${type.startsWith('#') ? type.replace(/#/, '') : type}`} />
      </svg>
    );
  }

  return <i className={cn('biconfont', [`bicon-${subType}${type}`], className)} style={style} />;
};


export default Index;
