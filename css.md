# 文本溢出隐藏
	当view里面套text时
		单行给view加
		多行给view、text都可以
	单行
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	多行
		overflow: hidden;
		text-overflow: ellipsis;
		word-wrap: break-word;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;