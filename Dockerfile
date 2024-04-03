# instruction for installation:
# remove old image/container/cache from docker 'docker system prune -a' if needed
# get the latest source code with git clone GITHUB_CODE and jump to 'develop' branch
# build the docker image with 'docker build -t oc_dash .'
# run the container from the image 'docker run -p 80:4200 oc_dash'
# while this container is alive go into it 'docker exec -ti 8 bash'
# comment three lines of code within file 'nano node_modules/ngx-mapbox-gl/fesm2022/ngx-mapbox-gl.mjs'
# comment lines '       //if (options.customMapboxApiUrl) {
                        # //    MapboxGl.baseApiUrl = options.customMapboxApiUrl;
                        # //}'


FROM node:20

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN apt-get update

RUN apt-get install nano -y

RUN npm install -g @angular/cli

RUN npm install

CMD ["ng", "serve", "--host", "0.0.0.0"]
