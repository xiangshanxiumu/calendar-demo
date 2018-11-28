(function(){//IIFE
    window.Calendar = Calendar;//挂载到window下面
 
	//申明Calendar的构造函数
    function Calendar(JSON){
    	//this.inputBox = null;//存放当前日期
		this.calendarDiv = null;//存放顶部 年 月
		this.calendarSelectBox = null;
    	this.yearSelect = null;
		this.monthSelect = null;
		this.holidaySelect = null;
    	this.tds = null;
    	this.year = (new Date()).getFullYear();
    	this.month = (new Date()).getMonth()+1;
    	this.date = (new Date()).getDate();//当前日期

    	this.init(JSON);

		this.getDay(this.year,this.month,this.date);
		
		this.getTime();
        //绑定事件
    	this.bindEvent();
    }

    Calendar.prototype.init = function(JSON){
    	this.dom = document.getElementById(JSON["id"]);//获取dom入口节点

        this.calendarDiv = document.createElement("div");
        this.calendarDiv.className = "calendarDiv";
        this.dom.appendChild(this.calendarDiv);

        //日历选择栏 年份、月份等选择
        this.calendarSelectBox =document.createElement("div");
        this.calendarSelectBox.className = "calendarSelectBox";
        this.calendarDiv.appendChild(this.calendarSelectBox);

        //下拉年份
        this.yearSelect = document.createElement("select");
        this.calendarSelectBox.appendChild(this.yearSelect);
        for(var i=1990;i<=2050;i++){
        	var option = document.createElement("option");
        	option.value = i;
        	option.innerHTML = i+"年";
        	this.yearSelect.appendChild(option);
        }

        //左箭头
        this.leftArrow = document.createElement("p");
        this.leftArrow.innerHTML = "&lt;";
        this.calendarSelectBox.appendChild(this.leftArrow);

        //下拉月份
        this.monthSelect = document.createElement("select");
        this.calendarSelectBox.appendChild(this.monthSelect);
        var monthArr = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
        for (var i =0; i <monthArr.length; i++) {
        	var option = document.createElement("option");
        	option.value = i+1;
        	option.innerHTML = monthArr[i];
        	this.monthSelect.appendChild(option);
        }
        
         //右箭头
        this.rightArrow = document.createElement("p");
        this.rightArrow.innerHTML = "&gt;";
        this.calendarSelectBox.appendChild(this.rightArrow);

        //假期选择
        this.holidaySelect = document.createElement("select");
        this.calendarSelectBox.appendChild(this.holidaySelect);
        var holidayArr = ["假期安排","元旦","除夕","春节","清明节","劳动节","端午节","中秋节","国庆节"];
        for(var i=0;i<holidayArr.length;i++){
        	var option = document.createElement("option");
        	option.value = i;
        	option.innerHTML = holidayArr[i];
        	this.holidaySelect.appendChild(option);
        }

        //返回今天
        this.backToday = document.createElement("p");
        this.calendarSelectBox.appendChild(this.backToday);
        this.backToday.innerHTML = "返回今天";
        
        //日历显示表格
        this.tableDom = document.createElement("table")
        this.calendarDiv.appendChild(this.tableDom);

        var weekArr = ["周日","周一","周二","周三","周四","周五","周六"];
        this.tr = document.createElement("tr");

        for(var i=0;i<weekArr.length;i++){
        	var th = document.createElement("th");
        	th.innerHTML = weekArr[i];
        	this.tr.appendChild(th);
        }
        this.tableDom.appendChild(this.tr);

        for(var i=0;i<6;i++){
        	var tr = document.createElement("tr");
        	for(var j=0;j<7;j++){
        		var td = document.createElement("td");
        		tr.appendChild(td);
        	}
        	this.tableDom.appendChild(tr);
        }

        this.tds = this.tableDom.getElementsByTagName("td");

        //calendarDiv外面右侧盒子
        this.rightBox = document.createElement("div");
        this.rightBox.className = "rightBox";
        this.dom.appendChild(this.rightBox);

        this.dateTxt = document.createElement("p");//日期 x年x月x日
        this.dateTxt.className = "dateTxt";
        this.rightBox.appendChild(this.dateTxt);

        this.dayTxt = document.createElement("p");//星期几
        this.dayTxt.className = "dayTxt";
        this.rightBox.appendChild(this.dayTxt);

        this.currentDay = document.createElement("div"); //当前日期 几号？
        this.currentDay.className = "currentDay";
        this.rightBox.appendChild(this.currentDay);
		
		this.currentTimeBox = document.createElement("div")//当前时间 时-分-秒
		this.currentTimeBox.className = "currentTimeBox";
		this.rightBox.appendChild(this.currentTimeBox);
		
		this.currentTime = document.createElement("div");
		this.currentTime.className = "currentTime";
		this.currentTimeBox.appendChild(this.currentTime);
        //小时
		hour = document.createElement("span");
		hour.className = "hour";
		this.currentTime.appendChild(hour);
        //分钟
		minute = document.createElement("span");
		minute.className = "minute";
		this.currentTime.appendChild(minute);
        //秒
		second = document.createElement("span");
		second.className = "second";
		this.currentTime.appendChild(second);
    }
	//获取当前小时-分钟-秒
	Calendar.prototype.getTime = function(){
		const nowTime = new Date();
		let nowHour = nowTime.getHours();
		let nowMinute = nowTime.getMinutes();
		let nowSecond = nowTime.getSeconds();
		console.log(nowHour);
		console.log(nowMinute);
		console.log(nowSecond);
		hour.innerHTML = nowHour;
		minute.innerHTML = nowMinute;
		second.innerHTML = nowSecond;
	}
    //获取日期
    Calendar.prototype.getDay = function(year,month,date){
         this.year = year;
         this.month = month;
		 //date&&(this.date = date);
		 this.date = date;
         this.yearSelect.value = this.year;
         this.monthSelect.value = this.month;

         //获取当前月第一天 是周几？利用Date()对象属性
         var thisMonthFirstDate = this.thisMonthFirstDate = new Date(year,month-1,1).getDay();
         //上一个末尾时间戳  获取上月多少天？
         var prevMonthSumDate = this.prevMonthSumDate = new Date(new Date(year,month-1,1)-1).getDate();
         //获取本月多少天？
         var thisMonthSumDate = this.thisMonthSumDate = (function(){
         	switch(month){
         		case 1:
         		case 3:
         		case 5:
         		case 7:
         		case 8:
         		case 10:
         		case 12:
         		    return 31;
         		    break;
         		case 4:
         		case 6:
         		case 9:
         		case 11:
         		     return 30;
         		     break;
         		case 2:
         		     if(year%4==0&&year%100==0||year%400==0){
         		     	return 29;
         		     }
         		     return 28;
         		     break;
            }
         })();

         //渲染上月
         for(var i=0;i<thisMonthFirstDate;i++){
           this.tds[i].innerHTML = prevMonthSumDate-thisMonthFirstDate+1+i;
           this.tds[i].className = "col";
         }
         //渲染本月
         for(var i=thisMonthFirstDate;i<thisMonthSumDate+thisMonthFirstDate;i++){
			this.tds[i].className = "";
			if(this.tds[i].innerHTML==date){
				this.tds[i].className = "cur";
			 }
         	this.tds[i].innerHTML = i-thisMonthFirstDate+1;
         }
         //渲染下月
         for(var i=thisMonthFirstDate+thisMonthSumDate;i<42;i++){
         	this.tds[i].innerHTML = i-(thisMonthFirstDate+thisMonthSumDate)+1;
         	this.tds[i].className = "col";
         }
            
         //渲染右侧盒子里面 年-月-日 星期几？
         this.dateTxt.innerHTML = year+"-"+month+"-"+date;//年-月-日？

         var n = new Date(year,month,(date-3)).getDay();
         var weekArr = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
         this.dayTxt.innerHTML = weekArr[n];//星期几？

         this.currentDay.innerHTML = date;//几号？

         //渲染假期和非假期显示效果
         if((this.month==1&&this.date==1)||(this.month==2&&this.date==15)||(this.month==2&&this.date==16)||(this.month==4&&this.date==5)
         	 ||(this.month==5&&this.date==1)||(this.month==6&&this.date==18)||(this.month==9&&this.date==24)||(this.month==10&&this.date==1)){
			this.calendarDiv.className = "calendarDivHoliday";  
			this.rightBox.className = "rightBoxHoliday";
            } else{
			this.holidaySelect.value = 0;
			this.calendarDiv.className = "calendarDiv";
			this.rightBox.className = "rightBox";
            }   	
    }
    
    // 绑定事件
    Calendar.prototype.bindEvent =function(){
    	var self = this;
    	//下拉年份事件
    	this.yearSelect.onchange = function () {
    		self.getDay(parseInt(self.yearSelect.value),parseInt(self.monthSelect.value),self.date);
    	}
        //下拉月份事件
    	this.monthSelect.onchange = function(){
    		self.getDay(parseInt(self.yearSelect.value),parseInt(self.monthSelect.value),self.date);
    	}
    	//左箭头事件
    	//var n =self.monthSelect.value;
    	this.leftArrow.onclick = function(){
    	    self.monthSelect.value--;
    	    if(self.monthSelect.value<1){
    	    	self.monthSelect.value = 12
    	    	self.yearSelect.value--;
    	    }
        	self.getDay(parseInt(self.yearSelect.value),parseInt(self.monthSelect.value),self.date);
        }
    	//右箭头事件 
    	this.rightArrow.onclick = function(){
    		self.monthSelect.value++;
    	    if(self.monthSelect.value>12||self.monthSelect.value==""){//>12时 自加出现空值 那就加上空值判断解决
				self.yearSelect.value++;
				self.monthSelect.value = 1; 	
			}
			//console.log(self.monthSelect)
    	    //console.log(self.monthSelect.value);//
        	self.getDay(parseInt(self.yearSelect.value),parseInt(self.monthSelect.value),self.date);
    	}
    	//返回今天事件
    	this.backToday.onclick = function(){
    		var y = new Date().getFullYear();
    		var m =new Date().getMonth()+1;
    		var d =new Date().getDate();
			self.getDay(y,m,d);
    	}

    	//假期选择事件
    	this.holidaySelect.onchange = function(){
            //console.log(self.holidaySelect.value);
            var y = parseInt(self.yearSelect.value);
            var m = parseInt(self.monthSelect.value);
            var d = self.date;
			var h = self.holidaySelect.value;
            switch(h){
				case "0":
				self.backToday.onclick();
				break;
				case "1":
                m =1;
            	d= 1;
				return self.getDay(y,m,d);
				break;
				case "2":
                m =2;
            	d= 15;
				self.getDay(y,m,d);
				break;
				case "3":
				m =2;
				d= 16;
				self.getDay(y,m,d);
				break;
				case "4":
				m =4;
				d= 5;
				self.getDay(y,m,d);
				break;
				case "5":
				m =5;
				d= 1;
				self.getDay(y,m,d);
				break;
				case "6":
				m =6;
				d= 18;
				self.getDay(y,m,d);
				break;
				case "7":
				m =9;
				d= 24;
				self.getDay(y,m,d);
				break;
				case "8":
            	 m =10;
            	 d= 1;
            	 self.getDay(y,m,d);
				break;      
    	}

    	//给所有的tds绑定事件监听
    	for(var i=0;i<self.tds.length;i++){
    		(function(i){
    			self.tds[i].onclick = function(){
					var temp = i;//记住i的值
					//self.tds[tem].className = "cur";
    				
    				if(temp<self.thisMonthFirstDate){
    					if(self.month<=1){
    						var y = self.year-1;
    						var m = 12;
    						var d = self.prevMonthSumDate-self.thisMonthFirstDate+1+i;
    						self.getDay(y,m,d);
    					} else  {
    						var y = self.year;
    						var m = self.month-1;
    						//d
    						var d = self.prevMonthSumDate-self.thisMonthFirstDate+1+i;
    						self.getDay(y,m,d);
    					}

    				} else if(temp<self.thisMonthFirstDate+self.thisMonthSumDate){
    					var y = self.year;
    					var m = self.month;
    					var d = temp-self.thisMonthFirstDate+1;
    					self.getDay(y,m,d);
    				} else {
    					if(self.month+1>12){
    						var y = self.year+1;
    						var m = 1;
    						var d = temp-(self.thisMonthFirstDate+self.thisMonthSumDate)+1;
    						self.getDay(y,m,d);
    					} else{
    						var y = self.year;
    						var m = self.month+1;
    						var d = temp-(self.thisMonthFirstDate+self.thisMonthSumDate)+1;
    						self.getDay(y,m,d);
    					}
    				}
    			}

    		})(i);
    	}
	}
    }
})();