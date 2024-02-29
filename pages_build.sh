#!/bin/bash

set -e

git checkout gh-pages
git reset --hard main
rm -fr docs
pnpm run build
touch .nojekyll
mv dist docs
cp public/* docs
git add docs
git add .nojekyll
git commit -m build
git push -f origin
git checkout -
