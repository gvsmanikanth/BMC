echo "Running Gulp AEM Build..."
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
"$DIR/build/build.sh" aem-production
