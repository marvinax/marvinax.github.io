var param1 = {
	// Adjustable parameters should include the min/max value and
	// current value that modified by slider. The parameters that
	// directly defined by user should be mentioned at first.
	bellowLength: {min:0.75, max:1.5, val:0.8},
	radius: {min: 8, max:12, val:10},
	stubLength : {min:10, max:20, val:10},
	bodyLength : {min:25, max:35, val:25},
	lengthAngle: {min:0, max: Math.PI/50, val:Math.PI/80},

	// Define the shape of the vertex matrix, make sure to define
	// the getter "shape".

	shape : [27, 30],

	regions : {
		all : [undefined, undefined],
		stub : [ {slice: 1} , undefined],
		body : [ {slice: -1}, undefined],
		ridge : [{start:2, end:-2, every: 2}, ]
	},

	regionModifiers : [
		{	// if undefined on that slot, return true
			case : function(ithSpec){ return !ithSpec },	
			is : function(){ return 1; },
			do : function(ithSpec, ithShape){console.log(Array.range(ithShape)); return Array.range(ithShape)}
		},
		{	// Accepts {start: , end: , every : , shift : ,}
			case : function(ithSpec){ return ithSpec && ithSpec.start },
			is : function(dim, ithSpec, ithShape){
				// var isInInterval = dim >= ithSpec.start && dim <= ithSpec.end;
				var isInInterval = dim >= r(ithSpec.start, ithShape) && dim <= r(ithSpec.end, ithShape);
				return isInInterval && ((dim + (ithSpec.shift ? ithSpec.shift : 0)) % (ithSpec.every ? ithSpec.every : 1) == 0 );
			},
			do : function(ithSpec, ithShape){
				var start = r(ithSpec.start, ithShape) - 1,
					end = r(ithSpec.end, ithShape) + 1;
				return Array.range(ithShape).slice(start, end)
							.filter(function(e){ return e % (ithSpec.every ? ithSpec.every : 1)==0; });
			}
		},
		{	// Accepts {slice:}
			case : function(ithSpec){ return ithSpec && ithSpec.slice },
			is : function(dim, ithSpec, ithShape){
				return dim == r(ithSpec.slice, ithShape);
			},
			do : function(ithSpec, ithShape){ return [ithSpec.slice]; }
		}
	],

	transforms : {
		'stretchStub' : {
			affectedRegion : 'stub'
		},
		'stretchBody' : {
			affectedRegion : 'body'
		},
		'makeRidge' : {
			affectedRegion : 'ridge'
		},
		'rollAroundCenter' : {
			affectedRegion : 'all',
			affectedDimension : 1
		},
		'rollTheRidgePart' : {
			affectedRegion : 'all',
			affectedDimension : 0
		}
	},

	// The constants that derived from the adjustable parameters
	// yet not accompanied with vertex index should be defined as
	// getters.
	trans: new THREE.Vector3(),

	leng: new THREE.Vector3(),

	axisX : new THREE.Vector3(1, 0, 0),

	axisZ : new THREE.Vector3(0, 0, 1),

	transRollMatrix : new THREE.Matrix4(),

	lengthRollMatrix : new THREE.Matrix4(),

	transRollMatrices : Array.constDeep(30, THREE.Matrix4),

	lengthRollMatrices : Array.constDeep(27, THREE.Matrix4)
};

var code1 = function(param){

	param.trans.set(0, -Math.sin(Math.PI/(param.shape[1]-1))*param.radius.val, 0);
	param.leng.set(param.bellowLength.val, 0, 0);

	param.transRollMatrices[0].makeRotationAxis( param.axisX, 2*(Math.PI/(param.shape[1]-1)) );
	param.transRollMatrices[0].setPosition(param.trans);

	param.lengthRollMatrices[0].makeRotationAxis( param.axisZ, 2*param.lengthAngle.val);
	param.lengthRollMatrices[0].setPosition(param.leng);

	for(var i = 1; i < 30; i++){
		param.transRollMatrices[i].multiplyMatrices(param.transRollMatrices[i-1], param.transRollMatrices[0]);
	}

	for(var i = 1; i < 27; i++){
		param.lengthRollMatrices[i].multiplyMatrices(param.lengthRollMatrices[i-1], param.lengthRollMatrices[0]);
	}


	this.forEach(function(e){e.set(0, 0, 0)});

	param.regions.stub.index.forEach(function(i){
		this[i].add(new THREE.Vector3(-param.stubLength.val, 0, 0))
	}.bind(this));

	param.regions.body.index.forEach(function(i){
		this[i].add(new THREE.Vector3(param.bodyLength.val, 0, 0));
	}.bind(this));

	param.regions.ridge.index.forEach(function(i){
		this[i].add(new THREE.Vector3(1.3, 0, 1));
	}.bind(this));


	param.regions.all.index.forEach(function(i){
		this[i].applyMatrix4(param.transRollMatrices[param.array[i][1]]);
	}.bind(this));

	param.regions.all.index.forEach(function(i){
		this[i].applyMatrix4(param.lengthRollMatrices[param.array[i][0]]);
	}.bind(this));
}
