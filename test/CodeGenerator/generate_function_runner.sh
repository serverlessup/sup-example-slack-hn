#!/bin/bash
strindex() { 
  x="${1%%$2*}"
  [[ $x = $1 ]] && echo -1 || echo ${#x}
}

absPath() {
    if [[ -d "$1" ]]; then
        cd "$1"
        echo "$(pwd -P)"
    else 
        cd "$(dirname "$1")"
        echo "$(pwd -P)/$(basename "$1")"
    fi
}

SRC_HOME=/usr/src
echo 'Creating FunctionRunner...'
func_runner_file_name=$(echo /usr/src/app/__functionRunner__.js)
rm -rf $func_runner_file_name
cd $SST_FUNCTIONS_HOME/core
for i in $(ls *.js); do
	# add imports
	func_class_name=$(echo $i | sed 's/\.[^.]*$//')
	func_dest_file_name=$(echo '__'$func_class_name'__.js')
	echo 'var '$func_class_name' = require("./'$func_dest_file_name'")' >> $func_runner_file_name
done

# append prefix after imports
cat $SRC_HOME/CodeGenerator/__functionRunner__.js.prefix >> $func_runner_file_name
echo '' >> $func_runner_file_name

# create files and append to calls to function runner
for i in $(ls *.js); do
	# create js file for function
	func_class_name=$(echo $i | sed 's/\.[^.]*$//')
	func_src_file_name=$(echo $SST_FUNCTIONS_HOME'/core/'$i)
	func_dest_file_name=$(echo $SRC_HOME'/app/__'$func_class_name'__.js')
	echo 'Processing function '$func_class_name'; src='$func_src_file_name'; dest='$func_dest_file_name
	# remove if exists, then create
	rm -f $func_dest_file_name
	echo 'module.exports.run = ' >> $func_dest_file_name
	pushd $(dirname $(absPath $func_src_file_name))
	j2 $func_src_file_name >> $func_dest_file_name
	popd
	# add to __functionRunner__.js
	echo '   if (func == "'$func_class_name'") {' >> $func_runner_file_name
	echo '      var params = args;' >> $func_runner_file_name
	grep -E '\$DefaultParam\:[ ]*.*' $func_src_file_name | while read -r line; do
	 	param_name=$(echo $line | sed 's/^.*\:[ ]*\(.*\)$/\1/')
		param_value=$(cat $SST_PARAMS_HOME/default_params_test.txt | sed -n 's/^'$param_name'[^=]*=[ ]*\(.*\)$/\1/p')
		param_value=$(echo $param_value | sed 's/\"/\\\"/g')
		if [ $(strindex "$param_value" "{") == 0 ]
		then
			echo '      params["'$param_name'"] = JSON.parse("'$param_value'");' >> $func_runner_file_name
		else
			echo '      params["'$param_name'"] = "'$param_value'";' >> $func_runner_file_name
		fi
	done
	echo '      '$func_class_name'.run(params, callback);' >> $func_runner_file_name
	echo '   }' >> $func_runner_file_name
done

# append suffix
cat $SRC_HOME/CodeGenerator/__functionRunner__.js.suffix >> $func_runner_file_name
echo 'FunctionRunner created.'