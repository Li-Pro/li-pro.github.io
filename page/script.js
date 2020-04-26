

/* Function adapt & slightly modified from https://stackoverflow.com/a/6234804 */
function escapeHtml(unsafe)
{
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;")
		 
		 .replace('\t', "&emsp;");
 }

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
		
		setTimeout(()=>{ doTypeWriting(arr, arri+1, 0, ele, linesprf, ''); }, 50);
	}
	else
	{
		if (arrx[arrj] == '\t')
		{
			linesprf += hljs.highlight('cpp', prf).value + '&emsp;&emsp;';
			prf = '';
		}
		else prf += arrx[arrj];
		
		ele.innerHTML = linesprf + hljs.highlight('cpp', prf).value + '<span class="coding-cursor"></span>';
		
		setTimeout(()=>{ doTypeWriting(arr, arri, arrj+1, ele, linesprf, prf); }, 50);
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
		"#ifdef lioraju",
		"	#define ndbg(x) ",
		"#else",
		"	#define ndbg(x) x",
		"#endif",
		"",
		"int main()",
		"{",
		"	ndbg( ios::sync_with_stdio(0); cin.tie(0); );",
		"}",
		"// LiPro's programming style in programming contest (2020-04-25)"
	);
	
	doTypeWriting(txt, 0, 0, obj);
}

initTypeWriter()