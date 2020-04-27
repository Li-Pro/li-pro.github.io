
/* The typewriter effect */
function doTypeWriting(arr, arri, arrj, ele, linesprf='', prf='')
{
	var len = arr.length;
	if (arri >= len)
	{
		ele.innerHTML = linesprf + '<span class="code-cursor"></span>';
		return;
	}
	
	var arrx = arr[arri];
	var lenx = arrx.length;
	
	if (arrj >= lenx)
	{
		linesprf += hljs.highlight('cpp', prf).value + ' <br>';
		ele.innerHTML = linesprf + '<span class="coding-cursor"></span>';
		
		setTimeout(()=>{ doTypeWriting(arr, arri+1, 0, ele, linesprf, ''); }, 30);
	}
	else
	{
		prf += arrx[arrj]; // <pre> reserve whitepaces
		ele.innerHTML = linesprf + hljs.highlight('cpp', prf).value + '<span class="coding-cursor"></span>';
		
		setTimeout(()=>{ doTypeWriting(arr, arri, arrj+1, ele, linesprf, prf); }, 30);
	}
}

function initTypeWriter()
{
	var obj = document.getElementById('typewriter');
	var txt = new Array(
		"#include<iostream>",
		"using namespace std;",
		"",
		"#define int long long",
		"",
		"#ifdef lioraju",
		"	#define ndbg(x) ",
		"#else",
		"	#define ndbg(x) x",
		"#endif",
		"",
		"signed main()",
		"{",
		"	ndbg( ios::sync_with_stdio(0); cin.tie(0); );",
		"}",
		"// LiPro's programming style in programming contest (2020-04-25)"
	);
	
	doTypeWriting(txt, 0, 0, obj);
}

initTypeWriter()