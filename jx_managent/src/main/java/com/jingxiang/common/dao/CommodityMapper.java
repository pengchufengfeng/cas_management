package com.jingxiang.common.dao;

import com.jingxiang.common.dao.core.CrudDao;
import com.jingxiang.common.entity.Commodity;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CommodityMapper extends CrudDao<Commodity> {


}
