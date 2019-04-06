package com.jingxiang.common.controller.commodity;

import com.github.pagehelper.PageInfo;
import com.jingxiang.common.entity.Commodity;
import com.jingxiang.common.entity.common.Paging;
import com.jingxiang.common.entity.request.CommodityPageReq;
import com.jingxiang.common.entity.request.CommodityRequet;
import com.jingxiang.common.service.CommodityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/commodity")
public class CommodityController {
    @Autowired
	private CommodityService commodityService;

    @PostMapping("/findList")
	public List<Commodity> findListCommodity(@RequestBody CommodityRequet commodityRequet){
		Commodity commodity = new Commodity();//添加自定义查询

		return commodityService.findListCommodity(commodity);
	}//列表查询

	@PostMapping("/findPage")
	PageInfo<Commodity> findPageCommodity(@RequestBody CommodityPageReq commodityPageReq){
		Commodity commodity = new Commodity();
		Paging page = new Paging();
		page.setPageNum(commodityPageReq.getPageNum());
		page.setPageSize(commodityPageReq.getPageSize());
		return commodityService.findPageCommodity(page,commodity);
	}//分页查询
	
	@PostMapping("/getOne")
	public Commodity getOneCommodity(@RequestParam("id") String id){
		return commodityService.getOneCommodity(id);
	}
	@PostMapping("/addOne")
	public int addCommodity(@RequestBody Commodity commodity){
		return commodityService.addOneCommodity(commodity);
	}
	@PostMapping("/deleteOne")
	public int deleteCommodity(@RequestBody Commodity commodity){
		
		return commodityService.deleteOneCommodity(commodity);
	}
	@PostMapping("/updateOne")
	public int updateCommodity(@RequestBody Commodity commodity){
		return commodityService.updateOneCommodity(commodity);
	}
	

}
