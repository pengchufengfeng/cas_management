package com.bucg.sso.config;

import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import com.bucg.sso.model.bean.ResponseBean;




/**
 * Created by pcf on 2017/6/11.
 */
@Configuration
public class webAppConfig extends WebMvcConfigurerAdapter {
  
  @Override
	public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
	  
        argumentResolvers.add(new responseBeanArgumentResolver());
    }
}
	
class responseBeanArgumentResolver  implements HandlerMethodArgumentResolver  {

	@Override
	public boolean supportsParameter(MethodParameter parameter) {
		
		return parameter.getParameterType().equals(ResponseBean.class);
	}

	@Override
	public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
			NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
		
			return new ResponseBean();
		
	}

	
	
	
}

/*@Configuration
class WebMvcConfiguration  extends WebMvcConfigurationSupport {

    @Override
    protected void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {

        argumentResolvers.add(new responseBeanArgumentResolver());
    }
    }*/