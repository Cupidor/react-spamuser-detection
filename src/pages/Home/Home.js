import React, { PureComponent } from 'react';
import { Table, message, Tag } from 'antd';
import ReactEcharts from 'echarts-for-react';
import global from '@/global.less';
import Footer from '@/components/Footer';
import { queryBlogByCondition } from '@/services/blog_user';
import * as echarts from 'echarts/core';
import {
  TimelineComponent,
  TooltipComponent,
  GridComponent
} from 'echarts/components';
import {
  CustomChart
} from 'echarts/charts';
import {
  CanvasRenderer
} from 'echarts/renderers';

echarts.use(
  [TimelineComponent, TooltipComponent, GridComponent, CustomChart, CanvasRenderer]
);

import ecStat from 'echarts-stat';

const { CheckableTag } = Tag;

const tagsData = ['用户权威度', '用户关注度', '纯粉丝度', '用户头像特征', '近期活跃度'];

var DIM_CLUSTER_INDEX = 2;
var DATA_DIM_IDX = [0, 1];
var CENTER_DIM_IDX = [3, 4];

var colorAll = [
  '#bbb', '#37A2DA', '#e06343', '#37a354', '#b55dba', '#b5bd48', '#8378EA', '#96BFFF'
];
var ANIMATION_DURATION_UPDATE = 1500;

function renderItemPoint(params, api) {
  var coord = api.coord([api.value(0), api.value(1)]);
  var clusterIdx = api.value(2);
  if (clusterIdx == null || isNaN(clusterIdx)) {
    clusterIdx = 0;
  }
  var isNewCluster = clusterIdx === api.value(3);

  var extra = {
    transition: []
  };
  var contentColor = colorAll[clusterIdx];

  return {
    type: 'circle',
    x: coord[0],
    y: coord[1],
    shape: {
      cx: 0,
      cy: 0,
      r: 10
    },
    extra: extra,
    style: {
      fill: contentColor,
      stroke: '#333',
      lineWidth: 1,
      shadowColor: contentColor,
      shadowBlur: isNewCluster ? 12 : 0,
      transition: ['shadowBlur', 'fill']
    }
  };
}

var targetRenderProgress = 0;

function renderBoundary(params, api) {
  var xVal = api.value(0);
  var yVal = api.value(1);
  var maxDist = api.value(2);
  var center = api.coord([xVal, yVal]);
  var size = api.size([maxDist, maxDist]);

  return {
    type: 'ellipse',
    shape: {
      cx: isNaN(center[0]) ? 0 : center[0],
      cy: isNaN(center[1]) ? 0 : center[1],
      rx: isNaN(size[0]) ? 0 : size[0] + 15,
      ry: isNaN(size[1]) ? 0 : size[1] + 15
    },
    extra: {
      renderProgress: ++targetRenderProgress,
      enterFrom: {
        renderProgress: 0
      },
      transition: 'renderProgress'
    },
    style: {
      fill: null,
      stroke: 'rgba(0,0,0,0.2)',
      lineDash: [4, 4],
      lineWidth: 4
    }
  };
}

function makeStepOption(option, data, centroids) {
  var newCluIdx = centroids ? centroids.length - 1 : -1;
  var maxDist = 0;
  for (var i = 0; i < data.length; i++) {
    var line = data[i];
    if (line[DIM_CLUSTER_INDEX] === newCluIdx) {
      var dist0 = Math.pow(line[DATA_DIM_IDX[0]] - line[CENTER_DIM_IDX[0]], 2);
      var dist1 = Math.pow(line[DATA_DIM_IDX[1]] - line[CENTER_DIM_IDX[1]], 2);
      maxDist = Math.max(maxDist, dist0 + dist1);
    }
  }
  var boundaryData = centroids
    ? [
      [
        centroids[newCluIdx][0],
        centroids[newCluIdx][1],
        Math.sqrt(maxDist)
      ]
    ]
    : [];
  option.options.push({
    series: [{
      type: 'custom',
      encode: {
        //tooltip: [0, 1]
      },
      renderItem: renderItemPoint,
      data: data
    }, {
      type: 'custom',
      renderItem: renderBoundary,
      animationDuration: 3000,
      silent: true,
      data: boundaryData
    }]
  });
}


class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      selectedTags: ['用户权威度', '用户关注度'],
      originalData: [],
      loading: false
    };
  }

  componentDidMount() {
    this.getAllBlogUser()
  }

  // 查询所有的微博用户
  getAllBlogUser = async () => {
    this.setState({
      loading: true
    })
    let res = await queryBlogByCondition(
      {
        limit: 200,
        offset: 0,
        scrapyState: true
      }
    );
    if (res.code === '0000') {
      message.destroy()
      for (let item of res.result) {
        item.key = item.id
      }
      this.setState({
        users: res.result,
        loading: false
      }, () => {
        this.getValue()
      })
    } else {
      message.error(res.message);
    }
  }

  // 筛选数据
  /*  
  authority: 用户权威度：粉丝数/粉丝数+关注数量。用户权威度越低越倾向于垃圾用户
  friendsRate: 用户关注度：关注数量/粉丝数+关注数量。垃圾用户会大量关注别人，所以该值会偏高
  realFollow: 纯粉丝度：粉丝数-互粉数/粉丝数。该指标表述粉丝的质量，质量越高越好
  headPortrait:	用户头像特征：默认头像0,、非默认1。垃圾用户一般使用默认头像
  recentAtivity: 近期活跃度：近100条消息跨越天数/用户注册天数。垃圾用户该指标会偏高
  */
  getValue = () => {
    const { users, selectedTags } = this.state
    let originalData = []
    for (let item of users) {
      let obj = []
      for (let ele of selectedTags) {
        if (item[this.getFieldValue(ele)] === "-Infinity") {
          break
        } else {
          obj.push(parseFloat(item[this.getFieldValue(ele)].toFixed(6)))
        }
      }
      if (obj.length === 2) {
        originalData.push(obj)
      }
    }
    this.setState({
      originalData
    })
  }

  getFieldValue = (type) => {
    switch (type) {
      case '用户权威度':
        return 'authority'
      case '用户关注度':
        return 'friendsRate'
      case '纯粉丝度':
        return 'realFollow'
      case '用户头像特征':
        return 'headPortrait'
      case '近期活跃度':
        return 'recentAtivity'
    }
  }

  getOption() {
    const { selectedTags } = this.state
    var step = ecStat.clustering.hierarchicalKMeans(this.state.originalData, {
      clusterCount: 3,
      outputType: 'single',
      outputClusterIndexDimension: DIM_CLUSTER_INDEX,
      outputCentroidDimensions: CENTER_DIM_IDX,
      stepByStep: true
    });
    let option = {
      timeline: {
        top: 'center',
        right: 50,
        height: 300,
        width: 10,
        inverse: true,
        autoPlay: false,
        playInterval: 2500,
        symbol: 'none',
        orient: 'vertical',
        axisType: 'category',
        label: {
          formatter: '步骤 {value}',
          position: 10
        },
        checkpointStyle: {
          animationDuration: ANIMATION_DURATION_UPDATE
        },
        data: []
      },
      baseOption: {
        animationDurationUpdate: ANIMATION_DURATION_UPDATE,
        tooltip: {
          trigger: 'item',
          formatter: `${selectedTags[0]},${selectedTags[1]}: {c0}`
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          type: 'scatter'
        }]
      },
      options: []
    };
    makeStepOption(option, this.state.originalData);
    option.timeline.data.push('0');
    for (var i = 1, stepResult; !(stepResult = step.next()).isEnd; i++) {
      makeStepOption(
        option,
        echarts.util.clone(stepResult.data),
        echarts.util.clone(stepResult.centroids)
      );
      option.timeline.data.push(i + '');
    }
    if (option && typeof option === 'object') {
      return option;
    }
  }

  handleChange(tag, checked) {
    const { selectedTags } = this.state;
    const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
    if (nextSelectedTags.length > 2) {
      message.warning('最多选择2项，请先取消其他项再选择')
      return
    }
    this.setState({ selectedTags: nextSelectedTags }, () => {
      if (nextSelectedTags.length === 2) {
        this.getValue()
      }
    });
  }


  render() {
    const { selectedTags } = this.state
    return (
      <div className={global.MyMain}>
        <div className={global.MyContent}>
          <div className={global.MyHeader} style={{ display: 'flex', justifyContent: 'center' }}>
            <span style={{ marginRight: 8 }}>选择分析项（2项）:</span>
            {tagsData.map(tag => (
              <CheckableTag
                key={tag}
                checked={selectedTags.indexOf(tag) > -1}
                onChange={checked => this.handleChange(tag, checked)}
              >
                {tag}
              </CheckableTag>
            ))}
          </div>
          <div className={global.MyBody}>
            <div className={global.MyBodyRight} style={{ padding: 12 }}>
              <ReactEcharts
                option={this.getOption()}
                notMerge={true}
                lazyUpdate={true}
                theme={'theme_name'}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>
        </div>
        <div className={global.MyFooter}>
          <Footer />
        </div>
      </div>
    );
  }
}

export default Index;
