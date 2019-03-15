function leaf(key,data){
	this.key = key;
	this.data = data;
	this.left = null;
	this.right = null;
	this.color = null;
	this.p = null;
}

function RBTree(){
	this.nil = Symbol('nil');
	this.root = this.nil;
	this.RED = Symbol.for('RED');
	this.BLACK = Symbol.for('BLACK');
}

RBTree.prototype = {
	constractor: RBTree,
	left_rotate: function( x ){
		// 确定 x 和 y.left(x.right.left) 的父子关系
		var y = x.right;
		x.right = y.left;
		if( y.left !== this.nil ){
			y.left.p = x;
		}

		// 确定 y 和 x.p 的父子关系
		y.p = x.p;
		if( x.p === this.nil ){
			this.root = y;
		}else if( x === x.p.left ){
			x.p.left = y;
		}else{
			x.p.right = y;
		}

		// 确定y和x的父子关系
		y.left = x;
		x.p = y;
	},
	right_rotate: function( x ){
		var y = x.left;
		x.left = y.right;
		if( y.right !== this.nil ){
			y.right.p = x;
		}

		y.p = x.p;
		if( x.p === this.nil ){
			this.root = y;
		}else if( x === x.p.left ){
			x.p.left = y;
		}else{
			x.p.right = y;
		}

		y.right = x;
		x.p = y;

	},
	RB_insert: function( z ){
		var y = this.nil;
		var x = this.root;
		while( x !== this.nil ){	// 用y和x配合找出z.p
			y = x;	
			x = z.key < x.key ? x.left : x.right;
		}

		z.p = y;  

		if( y === this.nil ){
			this.root = z;
		}else if( z.key < y.key ){
			y.left = z;
		}else{
			y.right = z;
		}

		z.left = this.nil;
		z.right = this.nil;
		z.color = this.RED;

		this.RB_insert_fixup( z );
	},

	RB_insert_fixup: function( z ) {
		while( z.p.color === this.RED ){

			if( z.p === z.p.p.left ){
				var y = z.p.p.right;
				if( y.color === this.RED ){
					y.color = this.BLACK;
					z.p.color = this.BLACK;
					z.p.p.color = this.RED;
					z = z.p.p;
				}else{
					if( z === z.p.right ){
						z = z.p;
						this.left_rotate( z );
					}
					z.p.color = this.BLACK;
					z.p.p.color = this.RED;
					this.right_rotate( z.p.p );
				}
			}else{
				var y = z.p.p.left;
				if( y.color === this.RED ){
					y.color = this.BLACK;
					z.p.color = this.BLACK;
					z.P.P.color = this.RED;
					z = z.p.p;
				}else{
					if( z === z.p.left ){
						z = z.p;
						this.right_rotate( z );
					}
					z.p.color = this.BLACK;
					z.p.p.color = this.RED;
					this.left_rotate( z.p.p );
				}
			}

		};

		this.root.color = this.BLACK;
	},
	RB_transplant: function( u, v ){ // 确定 u.p 和 v 之间的关系 (用 v 替换 u)
		if( u.p === this.nil ){
			this.root = v;
		}else if( u === u.p.left ){
			u.p.left = v;
		}else{
			u.p.right = v;
		}

		v.p = u.p;
	},
	minimum: function( z ){
		while( z.left !== this.nil ){
			z = z.left;
		}
		return z;
	},
	maximum: function( z ){
		while( z.right !== this.nil ){
			z = z.right;
		}
		return z;
	},
	successor: function( z ){
		if( z.right !== this.nil ){
			return this.minimum( z.right );
		}

		var y = z.p;
		while( y !== this.nil && z === y.right ){
			z = y;
			y = y.p;
		}

		return y;	// 有后继返回后继，没有后继返回 RBTree.nil
	},
	predecessor: function( z ){
		if( z.left !== this.nil ){
			return this.maximum( z.left );
		}

		var y = z.p;
		while( y !== this.nil && z === y.left ){
			z = y;
			y = y.p;
		}

		return y;   // 有前驱返回前驱，没有前驱返回 RBTree.nil
	},
	RB_delete_fixup: function( x ){
		while( x !== this.root && x.color === this.BLACK ){
			if( x === x.p.left ){
				var w = x.p.right;
				if( w.color === this.RED ){	// 将 w 转为黑色，w必须是黑色才能进行
					w.color = this.BLACK;
					x.p.color = this.RED;
					this.left_rotate( x.p );
					w = x.p.right;
				}

				if( w.left.color === this.BLACK && w.right.color === this.BLACK ){ // 如果 w左右都黑
					w.color = RED;
					x = x.p;
				}else{
					if( w.right.color === this.BLACK ){	// 如果 w 右黑 将其转为 右红
						w.left.color = this.BLACK;
						w.color = this.RED;
						this.right_rotate( w );
						w = x.p.right;
					}

					w.color = x.p.color;
					x.p.color = this.BLACK;
					w.right.color = this.BLACK;
					this.left_rotate( x.p );
					x = this.root;
				}
			}else{

				var w = x.p.left;
				if( w.color === this.RED ){	// 将 w 转为黑色，w必须是黑色才能进行
					w.color = this.BLACK;
					x.p.color = this.RED;
					this.right_rotate( x.p );
					w = x.p.left;
				}

				if( w.left.color === this.BLACK && w.right.color === this.BLACK ){ // 如果 w左右都黑
					w.color = RED;
					x = x.p;
				}else{
					if( w.right.color === this.BLACK ){	// 如果 w 右黑 将其转为 右红
						w.left.color = this.BLACK;
						w.color = this.RED;
						this.left_rotate( w );
						w = x.p.left;
					}

					w.color = x.p.color;
					x.p.color = this.BLACK;
					w.left.color = this.BLACK;
					this.right_rotate( x.p );
					x = this.root;
				}
			}	
		}
		x.color = this.BLACK;
	},
	RB_delete: function( z ){
		var y = z;
		var y_original_color = y.color;
		if( z.left === this.nil ){
			var x = z.right;
			this.RB_transplant( z, z.right );
		}else if( z.right === this.nil ){
			var x = z.left;
			this.RB_transplant( z, z.left );
		}else{
			y = this.minimum( z.right );	// 最小节点没有左子节点
			var x = y.right;
			
			if( y.p === z ){
				x.p = y;
			}else{
				this.RB_transplant( y, y.right );
				y.right = z.right;
				y.right.p = y;
			}

			this.RB_transplant( z, y );
			y.left = z.left;
			y.left.p = y;
			y.color = z.color;
		}

		if( y_original_color === this.BLACK ){
			this.RB_delete_fixup( x );
		}
	},
	RB_search: function( key ){
		var x = this.root;

		while( key !== x.key && x !== this.nil ){
			if( key < x.key ){
				x = x.left;
			}else{
				x = x.right;
			}
		}
		return x; // 存在返回节点，不存在返回RBTree.
	}
}

var T = new RBTree();
var l = new leaf( 2, 'aaaaa' );
T.RB_insert(l);
var l = new leaf( 35, 'bbbbb' );
T.RB_insert(l);
var l = new leaf( 78, 'ccccc' );
T.RB_insert(l);
var l = new leaf( -2, 'ddddd' );
T.RB_insert(l);
var l = new leaf( 2, 'eeeee' );
T.RB_insert(l);

var l = T.RB_search(35);

T.RB_delete( l );

mid( T.root );

function mid( t ){
	if( t !== T.nil ){
		mid(t.left);
		console.log(t.data);
		mid(t.right);
	}
}