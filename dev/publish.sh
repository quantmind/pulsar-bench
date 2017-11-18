cd .. && git clone git@github.com:quantmind/pulsar-bench.git gh-pages
cd gh-pages && git checkout -b gh-pages origin/gh-pages
rm -rf *
cp -a ../website/site/. .
git add * && git commit -a -m "new release [ci skip]" && git push origin gh-pages
cd .. && rm -rf gh-pages
cd website
