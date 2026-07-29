(function () {
  var FRAG = "#version 300 es\n" +
    "precision highp float;\n" +
    "out vec4 O;\n" +
    "uniform float time;\n" +
    "uniform vec2 resolution;\n" +
    "#define FC gl_FragCoord.xy\n" +
    "#define R resolution\n" +
    "#define T time\n" +
    "#define MN min(R.x,R.y)\n" +
    "float pattern(vec2 uv){\n" +
    "  float d=.0;\n" +
    "  for(float i=.0;i<3.;i++){ uv.x+=sin(T*(1.+i)+uv.y*1.5)*.2; d+=.005/abs(uv.x); }\n" +
    "  return d;\n" +
    "}\n" +
    "vec3 scene(vec2 uv){\n" +
    "  vec3 col=vec3(0);\n" +
    "  uv=vec2(atan(uv.x,uv.y)*2./6.28318,-log(length(uv))+T*0.5);\n" +
    "  for(float i=.0;i<3.;i++){ int k=int(mod(i,3.)); col[k]+=pattern(uv+i*6./MN); }\n" +
    "  return col;\n" +
    "}\n" +
    "void main(){\n" +
    "  vec2 uv=(FC-.5*R)/MN;\n" +
    "  vec3 col=vec3(0);\n" +
    "  float s=12., e=9e-4;\n" +
    "  col+=e/(sin(uv.x*s)*cos(uv.y*s));\n" +
    "  uv.y+=R.x>R.y?.5:.5*(R.y/R.x);\n" +
    "  vec3 raw=scene(uv);\n" +
    "  float lum=(raw.r+raw.g+raw.b);\n" +
    "  col+=vec3(lum)*vec3(0.80,0.85,0.97);\n" +
    "  col*=0.9;\n" +
    "  O=vec4(col,1.);\n" +
    "}";
  var VERT = "#version 300 es\n" +
    "precision highp float;\n" +
    "in vec2 position;\n" +
    "void main(){ gl_Position=vec4(position,0.,1.); }";

  function initShader(canvas) {
    var gl = canvas.getContext("webgl2", { alpha: true, antialias: true });
    if (!gl) { canvas.style.background = "#0a0c10"; return; }

    var compile = function (src, type) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
      }
      return s;
    };
    var prog = gl.createProgram();
    gl.attachShader(prog, compile(VERT, gl.VERTEX_SHADER));
    gl.attachShader(prog, compile(FRAG, gl.FRAGMENT_SHADER));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    var pos = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    var uT = gl.getUniformLocation(prog, "time");
    var uR = gl.getUniformLocation(prog, "resolution");

    var fit = function () {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var r = canvas.getBoundingClientRect();
      canvas.width = Math.floor(r.width * dpr);
      canvas.height = Math.floor(r.height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    fit();
    window.addEventListener("resize", fit);

    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var raf;
    var loop = function (now) {
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform1f(uT, now * 1e-3);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!reduceMotion) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  }

  window.addEventListener("DOMContentLoaded", function () {
    var c = document.getElementById("shader");
    if (c) initShader(c);
  });
})();
