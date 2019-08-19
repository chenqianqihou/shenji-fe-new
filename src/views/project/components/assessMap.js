export default {
  1: {
    title: '列入黑名单情形',
    map: [{
      label: '隐瞒审计发现的问题或者与被审计单位串通舞弊',
      type: 'radio',
      range: [1, 0]
    }, {
      label: '从被审计单位获取不正当利益',
      type: 'radio',
      range: [1, 0]
    }, {
      label: '违反“八不准”审计纪律，以及保密、廉政纪律或回避规定的',
      type: 'radio',
      range: [1, 0]
    }, {
      label: '不履行协议规定的其他义务，造成严重后果',
      type: 'radio',
      range: [1, 0]
    }, {
      label: '将审计项目转包或分包给其他单位或个人',
      type: 'radio',
      range: [1, 0]
    }]
  },
  3: {
    title: '业务部门考核（20分）',
    map: [{
      label: '审计方案确定的事项是否完成（3分）',
      type: 'radio',
      range: [1, 0]
    }, {
      label: '审计查出问题是否事实清楚、数据准确（2分）',
      type: 'radio',
      range: [1, 0]
    }, {
      label: '相关审计证据是否充分、恰当（5分）',
      type: 'radio',
      range: [1, 0]
    }]
  },
  2: {
    title: '审理部门考核（10分）',
    map: [{
      label: '审计方案确定的事项是否完成（6分）',
      type: 'radio',
      range: [1, 0]
    }, {
      label: '审计查出问题是否事实清楚、数据准确（6分）',
      type: 'radio',
      range: [1, 0]
    }, {
      label: '相关审计证据是否充分、恰当（8分）',
      type: 'radio',
      range: [1, 0]
    }]
  },
  7: [{
    title: '审计组考核（70分）',
    map: [{
      subTitle: '一、劳动纪律（10分）',
      subMap: [{
        label: '是否及时到位（2分）',
        type: 'radio',
        range: [1, 0]
      }, {
        label: '有无中途脱岗、未经请假迟到早退（2分）',
        type: 'radio',
        range: [1, 0]
      }, {
        label: '按期完成审计分工的审计事项（2分）',
        type: 'radio',
        range: [1, 0]
      }, {
        label: '及时移交相关资料（2分）',
        type: 'radio',
        range: [1, 0]
      }, {
        label: '在规定时间内完成组长分配的工作任务（2分）',
        type: 'radio',
        range: [1, 0]
      }]
    }, {
      subTitle: '二、审计工作质量（40分）',
      subMap: [{
        label: '是否按国家审计程序进行操作（4分）',
        type: 'radio',
        range: [1, 0]
      }, {
        label: '审计重点把握及工作深度是否到位（5分）',
        type: 'radio',
        range: [1, 0]
      }, {
        label: '所承担的审计事项中是否存在应发现未发现的问题（5分）',
        type: 'radio',
        range: [1, 0]
      }, {
        label: '发现问题的定性是否准确（5分））',
        type: 'radio',
        range: [1, 0]
      }, {
        label: '是否按规定制作审计证据、编写审计工作底稿等审计工作记录（5分）',
        type: 'radio',
        range: [1, 0]
      }, {
        label: '经复核不合格的审计证据、审计工作底稿等是否按规定补充完善（5分）',
        type: 'radio',
        range: [1, 0]
      }, {
        label: '审计过程中是否与审计组长、主审保持交流，如实汇报审计工作进展情况、审计发现问题和被审计单位意见。（5分）',
        type: 'radio',
        range: [1, 0]
      }, {
        label: '是否服从审计现场统一管理、有无擅自减少审计事项和扩大审计范围情况（6分）',
        type: 'radio',
        range: [1, 0]
      }]
    }, {
      subTitle: '三、廉政纪律（20分）',
      subMap: [{
        label: '是否按国家审计程序进行操作（5分）',
        type: 'radio',
        range: [1, 0]
      }, {
        label: '遵守保密纪律情况（5分）',
        type: 'radio',
        range: [1, 0]
      }, {
        label: '遵守廉政纪律情况（5分）',
        type: 'radio',
        range: [1, 0]
      }, {
        label: '执行回避规定情况（5分）',
        type: 'radio',
        range: [1, 0]
      }]
    }]
  }, {
    title: '加分项目（20分）',
    map: [{
      label: '发现重大问题线索或管理漏洞（15分）',
      type: 'radio',
      range: [1, 0]
    }, {
      label: '提出有建设性意见和建议被采纳（5分）',
      type: 'radio',
      range: [1, 0]
    }]
  }],
  4: {
    title: '主观评价',
    map: [{
      label: '审计分工是否恰当、是否明确将具体审计事项和审计措施等信息告知审计组成员，并组织审计人员进行讨论',
      type: 'select',
      range: [{
        label: '满分',
        value: 30
      }, {
        label: '优',
        value: 20
      }, {
        label: '良',
        value: 15
      }, {
        label: '一般',
        value: 10
      }, {
        label: '差',
        value: 0
      }]
    }, {
      label: '组织、协调、沟通能力；项目实施是否有序开展',
      type: 'select',
      range: [{
        label: '满分',
        value: 30
      }, {
        label: '优',
        value: 20
      }, {
        label: '良',
        value: 15
      }, {
        label: '一般',
        value: 10
      }, {
        label: '差',
        value: 0
      }]
    }, {
      label: '是否定期检查审计组成员的工作进展、是否按照审计准则规定复核审计人员的审计证据及审计工作底稿',
      type: 'select',
      range: [{
        label: '满分',
        value: 15
      }, {
        label: '优',
        value: 15
      }, {
        label: '良',
        value: 10
      }, {
        label: '一般',
        value: 5
      }, {
        label: '差',
        value: 0
      }]
    }, {
      label: '是否定期检查审计组成员的工作进展、是否按照审计准则规定复核审计人员的审计证据及审计工作底稿',
      type: 'select',
      range: [{
        label: '满分',
        value: 20
      }, {
        label: '优',
        value: 20
      }, {
        label: '良',
        value: 15
      }, {
        label: '一般',
        value: 10
      }, {
        label: '差',
        value: 0
      }]
    }, {
      label: '保持审计独立性，执行审计八不准纪律、遵守工作纪律、保密纪律等情况',
      type: 'select',
      range: [{
        label: '满分',
        value: 15
      }, {
        label: '优',
        value: 15
      }, {
        label: '良',
        value: 10
      }, {
        label: '一般',
        value: 5
      }, {
        label: '差',
        value: 0
      }]
    }]
  },
  5: {
    title: '主观评价',
    map: [{
      label: '审计分工是否恰当、是否明确将具体审计事项和审计措施等信息告知审计组成员，并组织审计人员进行讨论',
      type: 'select',
      range: [{
        label: '满分',
        value: 30
      }, {
        label: '优',
        value: 20
      }, {
        label: '良',
        value: 15
      }, {
        label: '一般',
        value: 10
      }, {
        label: '差',
        value: 0
      }]
    }, {
      label: '组织、协调、沟通能力；项目实施是否有序开展',
      type: 'select',
      range: [{
        label: '满分',
        value: 30
      }, {
        label: '优',
        value: 20
      }, {
        label: '良',
        value: 15
      }, {
        label: '一般',
        value: 10
      }, {
        label: '差',
        value: 0
      }]
    }, {
      label: '是否定期检查审计组成员的工作进展、是否按照审计准则规定复核审计人员的审计证据及审计工作底稿',
      type: 'select',
      range: [{
        label: '满分',
        value: 15
      }, {
        label: '优',
        value: 15
      }, {
        label: '良',
        value: 10
      }, {
        label: '一般',
        value: 5
      }, {
        label: '差',
        value: 0
      }]
    }, {
      label: '是否定期检查审计组成员的工作进展、是否按照审计准则规定复核审计人员的审计证据及审计工作底稿',
      type: 'select',
      range: [{
        label: '满分',
        value: 20
      }, {
        label: '优',
        value: 20
      }, {
        label: '良',
        value: 15
      }, {
        label: '一般',
        value: 10
      }, {
        label: '差',
        value: 0
      }]
    }, {
      label: '保持审计独立性，执行审计八不准纪律、遵守工作纪律、保密纪律等情况',
      type: 'select',
      range: [{
        label: '满分',
        value: 15
      }, {
        label: '优',
        value: 15
      }, {
        label: '良',
        value: 10
      }, {
        label: '一般',
        value: 5
      }, {
        label: '差',
        value: 0
      }]
    }]
  }
}
