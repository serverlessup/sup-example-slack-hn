#!/bin/bash
absPath() {
    if [[ -d "$1" ]]; then
        cd "$1"
        echo "$(pwd -P)"
    else 
        cd "$(dirname "$1")"
        echo "$(pwd -P)/$(basename "$1")"
    fi
}

strindex() { 
  x="${1%%$2*}"
  [[ $x = $1 ]] && echo -1 || echo ${#x}
}

source ./aws_set_env_prod.sh
action=$1
func_name=$2
func_file_name=$3
func_rel_file_name=$(echo $func_file_name | sed 's/.*\///')
func_rel_file_name=$(echo $func_rel_file_name | sed 's/\.[^.]*$//')
func_tmp_file_dir=$(echo $(dirname $(absPath ${BASH_SOURCE[0]}))'/release/prod/__'$func_rel_file_name'__')
func_tmp_file_name=$(echo $func_tmp_file_dir'/'$func_rel_file_name'.js')
mkdir -p $func_tmp_file_dir
if [ "$action" == "create-function" ]
then
	aws_cmd=$(echo 'aws lambda '$action' --function-name '$func_name' --role '$DEFAULT_LAMBDA_ROLE_ARN' --runtime nodejs4.3 --handler '$func_rel_file_name'.handler')
else
	aws_cmd=$(echo 'aws lambda '$action' --function-name '$func_name)
fi
pushd $(dirname $(absPath $func_file_name))
j2 $func_file_name > $func_tmp_file_name
popd
# create json file
param_first=true
param_json=$(echo "")
while read -r line; do
	param_name=$(echo $line | sed 's/^.*\:[ ]*\(.*\)$/\1/')
	if [ -n "$param_name" ]
	then
		if [ $param_first = true ]
		then
			param_first=false
			param_json=$(echo "{")
		else
			param_json=$(echo $param_json', ')
		fi
		param_value=$(cat ../../params/lambda/default_params_prod.txt | sed -n 's/^'$param_name'[^=]*=[ ]*\(.*\)$/\1/p')
		param_value=$(echo $param_value | sed "s/\'/\"/g")
		if [ $(strindex "$param_value" "{") == 0 ]
		then
			param_json=$(echo $param_json'"'$param_name'": '$param_value)
		else
			param_json=$(echo $param_json'"'$param_name'": "'$param_value'"')
		fi
	fi
done <<< "$(grep -E '\$DefaultParam\:[ ]*.*' $func_tmp_file_name)"
if [ $param_first = false ]
then
	param_json=$(echo $param_json' }')
fi
func_json_file_name=$(echo $func_tmp_file_dir'/config.json')
rm -rf $func_json_file_name
touch $func_json_file_name
if [ $param_first = false ]
then
	echo $param_json > $func_json_file_name
else
	echo '{}' > $func_json_file_name
fi
# zip up js and json
func_zip_file_name=$(echo $func_tmp_file_dir'/deployment.zip')
rm -rf $func_zip_file_name
zip -j $func_zip_file_name $func_tmp_file_name $func_json_file_name
func_json_rel_file_name=$(echo $func_json_file_name | sed 's/.*\///')
aws_cmd=$(echo $aws_cmd --zip-file fileb://$func_zip_file_name)
# run
echo $aws_cmd
eval $aws_cmd