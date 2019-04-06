package com.jingxiang.common.service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jingxiang.common.dao.core.CrudDao;
import com.jingxiang.common.entity.common.DataEntity;
import com.jingxiang.common.entity.common.Paging;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;


@Transactional
public abstract class CrudService<D extends CrudDao<T>, T extends DataEntity> {

    /**
     * 持久层对象
     */
    @Autowired
    private D dao;

    public D getDao() {
        return dao;
    }

    /**
     * 获取单条数据
     *
     * @param id 主键
     * @return 数据实体
     */
    public T get(String id) {
        return dao.get(id);
    }



    /**
     * 查询所有列表数据 *  
     * @return 实体对象列表
     * by 小纸
     */
    public List<T> findAllList() {
        return dao.findAllList();
    }
    
    /**
     * 查询列表数据
     *
     * @param entity 实体对象
     * @return 实体对象列表
     */
    public List<T> findList(T entity) {
        return dao.findList(entity);
    }


    /**
     * 查询分页数据
     *
     * @param page   分页对象
     * @param entity 实体对象
     * @return 分页数据
     */
    public PageInfo<T> findPage(Paging page, T entity) {
        PageHelper.startPage(page.getPageNum(), page.getPageSize(), page.getOrderBy());
        List<T> list = dao.findList(entity);
        return new PageInfo<>(list);
    }



    /**
     * 保存数据（插入或更新）
     *
     * @param entity 实体对象
     * @return 实体对象
     */
    @Transactional(readOnly = false)
    public T save(T entity) {
        if (entity.getIsNewRecord()) {
            entity.preInsert();
            dao.insert(entity);
        } else {
            entity.preUpdate();
            dao.update(entity);
        }
        return entity;
    }

    /**
     * 删除数据
     *
     * @param entity 实体对象
     */
    @Transactional(readOnly = false)
    public void delete(T entity) {
        dao.delete(entity);
    }

    /**
     * 删除数据
     *
     * @param id 主键
     */
    @Transactional(readOnly = false)
    public void deleteById(String id) {
        dao.deleteById(id);
    }

	
    
    



}
