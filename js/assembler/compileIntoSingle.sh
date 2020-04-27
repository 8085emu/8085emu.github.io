#!/bin/bash
files=('msgparser-e'n_gb asm parser assembler macro conditional dup comment symbol)

if [ $# -ge 1 ]; then
	outf=$1
else
	outf=_assembler.js
fi

if [ $# -ge 2 ]; then
	echo 'Exporting assembler.'"$2"
	exp="$2"
else
	echo 'Exporting assembler.compile'
	exp='assembler.compile'
fi

if [ $# -ge 3 ]; then
	expmsg="$3"
	echo "Exporting $3"
else
	expmsg="mesg"
	echo "Exporting mesg"
fi

echo "Compiling to $outf"
echo '' > "$outf"


for i in ${files[*]}; do
	echo -e "\n\n\n\n\n\n\n\n\n\n" >> "$outf"
	echo '/**************************************************************' >> "$outf"
	echo '*'$i >> "$outf"
	echo '**************************************************************/' >> "$outf"
	if [ $i = 'parser' ]; then
        echo 'var exprEval = require("./expr-eval");' >> "$outf"
    fi
	cat $i'.js' >> "$outf"
done

echo "module.exports.compileCode = $exp;" >> "$outf"
echo "module.exports.errorParser = $expmsg;" >> "$outf"

