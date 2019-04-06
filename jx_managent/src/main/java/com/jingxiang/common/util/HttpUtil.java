package com.jingxiang.common.util;

import net.sf.json.JSONObject;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;

import java.io.IOException;

/**
 * Created by lenovo on 2018-04-11.
 * HttpUntil
 */
public  class HttpUtil {
    public static JSONObject PostResult(String url,JSONObject params){
        HttpClient httpclient = new DefaultHttpClient();
        HttpPost httpPost = new HttpPost(url);
        //根据code获取信息 获取票据
        try{
            StringEntity myEntity = new StringEntity(params.toString(),"text/plain","utf-8");
            //设置需要传递的数据
            httpPost.setEntity(myEntity);
            ResponseHandler<JSONObject> responseHandler = new ResponseHandler<JSONObject>() {
                public JSONObject handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
                    int status = response.getStatusLine().getStatusCode();
                    HttpEntity entity = response.getEntity();
                    if (null != entity) {
                        String result = EntityUtils.toString(entity);
                        JSONObject resultObj = JSONObject.fromObject(result);
                        return resultObj;
                    } else {
                        return null;
                    }
                    /*if (status >= 200 && status < 300) {
                        HttpEntity entity = response.getEntity();
                        if (null != entity) {
                            String result = EntityUtils.toString(entity);
                            JSONObject resultObj = JSONObject.fromObject(result);
                            return resultObj;
                        } else {
                            return null;
                        }
                    } else {
                        throw new ClientProtocolException("Unexpected respons status:" + status);
                    }*/
                }
            };
            JSONObject responseBody = httpclient.execute(httpPost,responseHandler);
            return responseBody;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public static JSONObject GetResult(String url){
        HttpClient httpclient = new DefaultHttpClient();
        HttpGet httpGet = new HttpGet(url);

        try{
            ResponseHandler<JSONObject> responseHandler = new ResponseHandler<JSONObject>() {
                public JSONObject handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
                    int status = response.getStatusLine().getStatusCode();
                    HttpEntity entity = response.getEntity();
                    if (null != entity) {
                        String result = EntityUtils.toString(entity);
                        JSONObject resultObj = JSONObject.fromObject(result);
                        return resultObj;
                    } else {
                        return null;
                    }
                    /*if (status >= 200 && status < 300) {

                    } else {
                        throw new ClientProtocolException("Unexpected response status:" + status);
                    }*/
                }
            };
            JSONObject responseBody = httpclient.execute(httpGet, responseHandler);
            return responseBody;
        }catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
