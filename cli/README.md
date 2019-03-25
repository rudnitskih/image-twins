# Image Twins CLI

> Terminal image diff feature. CLI version of [Image Twins](https://image-twins.herokuapp.com/)

## Install

```
$ npm install @image-twins/cli
```

## Options

For reading *help* use this command

```
$ image-twins --help
```

If You want get *version*... Use this command

```
$ image-twins --version
```

### actualUrl (url)
A string contains full url of testing page

### actualImage (a, actual)
A string contains path to screenshot of testing page

### originalImage (o, origin)
A string contains path to mockup

### saveDiffTo (s, diff)
_Optional_: A path, where you want to save a diff

```
$ image-twins --url="https://www.google.com.ua/" --originalImage="../assets/original.png" --saveDiffTo="tmp/diff.png"
```
