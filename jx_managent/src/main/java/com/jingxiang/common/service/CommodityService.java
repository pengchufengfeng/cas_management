package com.jingxiang.common.service;

import com.github.pagehelper.PageInfo;
import com.jingxiang.common.entity.Commodity;
import com.jingxiang.common.entity.common.Paging;


import java.util.List;

public interface CommodityService {
	List<Commodity> findListCommodity(Commodity commodity);//列表查询

	PageInfo<Commodity> findPageCommodity(Paging page, Commodity commodity);//分页查询
	//获取商品详情
	Commodity  getOneCommodity(String id);
	//删除商品
	 int deleteOneCommodity(Commodity commodity);
	//更新商品
	 int updateOneCommodity(Commodity commodity);
	//新增商品
	 int addOneCommodity(Commodity commodity); 

}
