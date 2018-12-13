(function(){
    window.Calendar = Calendar;

    function Calendar(JSON){
    	this.inputBox = null;//存放当前日期
    	this.calendarDiv = null;//存放顶部 年 月
    	this.yearSelect = null;
    	this.monthSelect = null;
    	this.tds = null;
    	this.year = (new Date()).getFullYear();
    	this.month = (new Date()).getMonth()+1;
    	this.date = (new Date()).getDate();//当前日期

    	this.init(JSON);

    	this.getDay(this.year,this.month,this.date);
        //绑定事件
    	this.bindEvent();
    }

    Calendar.prototype.init = function(JSON){
    	this.dom = document.getElementById(JSON["id"]);
        // console.log(this.dom);
    	this.inputBox = document.createElement("input");
    	this.inputBox.type = "text";
    	this.dom.appendChild(this.inputBox);
        this.calendarDiv = document.createElement("div");
        this.calendarDiv.className = "calendarDiv";
        this.dom.appendChild(this.calendarDiv);

        //日历选择栏 年份、月份等选择
        this.calendarSelectBox =document.createElement("div");
        this.calendarSelectBox.className = "calendarSelectBox";
		this.calendarDiv.appendChild(this.calendarSelectBox);
		
		// 下拉年份外包裹盒子
		this.warpBox1 = document.createElement("div")
		this.calendarSelectBox.appendChild(this.warpBox1)
        //下拉年份
        this.yearSelect = document.createElement("select");
        this.warpBox1.appendChild(this.yearSelect);
        for(var i=1990;i<=2050;i++){
        	var option = document.createElement("option");
        	option.value = i;
        	option.innerHTML = i+"年";
        	this.yearSelect.appendChild(option);
        }
		//下拉月份和左右箭头外盒子
		this.wrapBox2 = document.createElement("div")
		this.calendarSelectBox.appendChild(this.wrapBox2);
		
        //左箭头
        this.leftArrow = document.createElement("button");
        this.leftArrow.innerHTML = "&lt;";
        this.wrapBox2.appendChild(this.leftArrow);

        //下拉月份
        this.monthSelect = document.createElement("select");
        this.wrapBox2.appendChild(this.monthSelect);
        var monthArr = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
        for (var i = 1; i <=monthArr.length; i++) {
        	var option = document.createElement("option");
        	option.value = i;
        	option.innerHTML =monthArr[i-1];
        	this.monthSelect.appendChild(option);
        }
        
         //右箭头
        this.rightArrow = document.createElement("button");
        this.rightArrow.innerHTML = "&gt;";
        this.wrapBox2.appendChild(this.rightArrow);
		// 下拉假期外包裹盒子
		this.wrapBox3 = document.createElement("div")
		this.calendarSelectBox.appendChild(this.wrapBox3);
        //假期选择
        this.holidaySelect = document.createElement("select");
        this.wrapBox3.appendChild(this.holidaySelect);
        var holidayArr = ["假期安排","元旦","除夕","春节","清明节","劳动节","端午节","中秋节","国庆节"];
        for(var i=0;i<holidayArr.length;i++){
        	var option = document.createElement("option");
        	option.value = i;
        	option.innerHTML = holidayArr[i];
        	this.holidaySelect.appendChild(option);
        }
		// 返回今天-外包裹盒子
		this.wrapBox4 = document.createElement("div")
		this.calendarSelectBox.appendChild(this.wrapBox4);
        //返回今天
        this.backToday = document.createElement("button");
        this.wrapBox4.appendChild(this.backToday);
        this.backToday.innerHTML = "返回今天";
        
        //日历显示表格
        this.tableDom = document.createElement("table")
        this.calendarDiv.appendChild(this.tableDom);

        var weekArr = ["日","一","二","三","四","五","六"];
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
		// 年月日-星期外包裹盒子
		this.wrapBox5 = document.createElement("div")
		this.wrapBox5.className = "wrapBox5";
		this.rightBox.appendChild(this.wrapBox5);

        this.dateTxt = document.createElement("div");//日期 x年x月x日
        this.dateTxt.className = "dateTxt";
        this.wrapBox5.appendChild(this.dateTxt);

        this.dayTxt = document.createElement("div");//星期几
        this.dayTxt.className = "dayTxt";
        this.wrapBox5.appendChild(this.dayTxt);

        this.currentDay = document.createElement("div"); //当前日期 几号？
        this.currentDay.className = "currentDay";
		this.rightBox.appendChild(this.currentDay);
		
		// 右侧盒子实时-时-分-秒
		this.ulTime = document.createElement("ul")
		this.ulTime.className = "ulTime"
		this.rightBox.appendChild(this.ulTime)
        var k = 0
		while(k<9){
		li = document.createElement("li")
		li.innerHTML = k
		this.ulTime.appendChild(li)
		k++
		}
    }

    //获取日期
    Calendar.prototype.getDay = function(year,month,date){
         this.year = year;
         this.month = month;
         date&&(this.date = date);

         this.yearSelect.value = this.year;
         this.monthSelect.value = this.month;

         //获取当前月第一天 是周几？利用Date()对象属性
         var thisMonthFirstDate = this.thisMonthFirstDate = new Date(year,month-1,1).getDay();
         //console.log(month);
         //console.log(new Date(year,month-1,1).getDay());
         //console.log(new Date(year,month-1,1));
         
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
         	this.tds[i].innerHTML = i-thisMonthFirstDate+1;
         }

         //渲染下月
         for(var i=thisMonthFirstDate+thisMonthSumDate;i<42;i++){
         	this.tds[i].innerHTML = i-(thisMonthFirstDate+thisMonthSumDate)+1;
         	this.tds[i].className = "col";
         }

         //渲染input文本里面 年-月-日
         if(date!=undefined){
         	// console.log(this.thisMonthFirstDate+date-1);
         	// console.log(this.thisMonthFirstDate);
         	// console.log(date);
            this.tds[this.thisMonthFirstDate+date-1].className = "cur";
            this.inputBox.value = year+"-"+month+"-"+date;
         	}
            
         //渲染右侧盒子里面 年-月-日 星期几？
         this.dateTxt.innerHTML = year+"-"+month+"-"+date;//年-月-日？

         var n = new Date(year,month,(date-3)).getDay();
         var weekArr = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
         this.dayTxt.innerHTML = weekArr[n];//星期几？

         this.currentDay.innerHTML = date;//几号？
		 //渲染实时 时-分-秒
		    var lis = this.ulTime.children
			// console.log(lis)
			lis[2].innerText = "时";
			lis[5].innerText = "分";
			lis[8].innerText = "秒";
		 timer = setInterval(function(){
			var DATE = new Date();
			var hour = DATE.getHours();
			var minute = DATE.getMinutes();
			var second = DATE.getSeconds();
			lis[0].innerText = parseInt(hour/10);
			lis[1].innerText = hour%10;
			lis[3].innerText = parseInt(minute/10);
			lis[4].innerText = minute%10;
			lis[6].innerText = parseInt(second/10);
			lis[7].innerText = second%10;
		 },1000);
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
    		self.inputBox.value = ""
    		self.getDay(parseInt(self.yearSelect.value),parseInt(self.monthSelect.value),self.date);
    	}
        //下拉月份事件
    	this.monthSelect.onchange = function(){
    		self.inputBox.value = ""
    		self.getDay(parseInt(self.yearSelect.value),parseInt(self.monthSelect.value),self.date);
    	}

    	//左箭头事件
    	//var n =self.monthSelect.value;
    	this.leftArrow.onclick = function(){
    		self.inputBox.value = "";
    	    self.monthSelect.value--;
    	    if(self.monthSelect.value<1){
    	    	self.monthSelect.value = 12
    	    	self.yearSelect.value--;
    	    }
        	self.getDay(parseInt(self.yearSelect.value),parseInt(self.monthSelect.value),self.date);
        }

    	//右箭头事件 
    	this.rightArrow.onclick = function(){
    		self.inputBox.value = ""
    		self.monthSelect.value++;
    	    if(self.monthSelect.value>12||self.monthSelect.value==""){//>12时 自加没有执行 if语句也就没有执行？ 后面代码报错
    	    	self.monthSelect.value = 1;
    	    	self.yearSelect.value++;
    	    }
    	    // console.log(self.monthSelect.value);//>12时 空输出？
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
            var d = parseInt(self.date);
			var h = parseInt(self.holidaySelect.value);
			console.log(typeof(h))
            switch (h) {
				case 0:
				  self.backToday.onclick();
				break;
				case 1:
				  m =1;
            	  d= 1;
				  self.getDay(y,m,d);
				break;
				case 2:
				  m =2;
				  d= 15;
				  self.getDay(y,m,d);
				break;
				case 3:
				  m =2;
				  d= 16;
				  self.getDay(y,m,d);
				break;
				case 4:
				  m =4;
				  d= 5;
				  self.getDay(y,m,d);
				break;
				case 5:
				  m =5;
				  d= 1;
				  self.getDay(y,m,d);
				break;
				case 6:
				  m =6;
				  d= 18;
				  self.getDay(y,m,d);
				break;
				case 7:
				  m =9;
				  d= 24;
				  self.getDay(y,m,d);
				break;
				case 8:
				  m =10;
				  d= 1;
				  self.getDay(y,m,d);
				break;
				default:
				  self.backToday.onclick();
			}              
    	}

    	//输入框获取焦点 显示日历
       this.inputBox.onfocus = function() {
           self.calendarDiv.style.display = "block";//左侧日历框
           self.rightBox.style.display = "block";//右侧盒子
       }
       // 点击除日历之外的地方隐藏日历
       document.addEventListener("click",function(event) {
             var event = window.event || event;
             //console.log(event.target);
             if(event.target!=self.calendarDiv&&event.target != self.inputBox && event.target!=self.yearSelect && event.target!=
                 self.monthSelect && event.target.nodeName != "TD" && event.target.nodeName !="TH"&&event.target!=
                 self.holidaySelect&&event.target!=self.backToday&&event.target!=self.leftArrow&&event.target!=self.rightArrow&&event.target!=
                 self.rightBox&&event.target!=self.dateTxt&&event.target!=self.dayTxt&&event.target!=self.currentDay&event.target!=self.calendarSelectBox) {
                      self.calendarDiv.style.display = "none";//隐藏左侧日历框
                      self.rightBox.style.display = "none";//隐藏右侧盒子
                 }
                 return false;
       },false);

        //从输入框输入数字 匹配日历对应的日期
    	self.inputBox.onkeyup = function(event){
    		var event = window.event || event;
    		if(event.keyCode==13){
    		var val = this.value;
    		var valArr = val.match(/(\d+)-(\d+)-(\d+)/);
    		if(valArr){
    			var year = parseInt(valArr[1]);
    			var month = parseInt(valArr[2]);
    			var date = parseInt(valArr[3]);
    			self.getDay(year,month,date);
    		}
    	}
    	}

    	//给所有的tds绑定事件监听
    	for(var i=0;i<self.tds.length;i++){
    		(function(i){
    			self.tds[i].onclick = function(){
    				var temp = i;//记住i的值
    				
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
})();