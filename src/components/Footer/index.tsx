import React from 'react';
import { DefaultFooter } from '@ant-design/pro-layout';
import { Typography } from 'antd';

const { Link } = Typography;

export default () => (
  /*<DefaultFooter
    copyright="中国石油天然气集团公司"
    links={[
      {
        key: '葛南云',
        title: 'Powered by 葛南云',
        href: 'http://www.njgn.com/cloudwebsite/#/home',
        blankTarget: true,
      },
    ]}
  />*/
  <Typography
    style={{
      height: 47,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Link style={{ color: 'grey' }}>
    垃圾用户检测系统
    </Link>
  </Typography>
);
