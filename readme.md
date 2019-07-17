![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)

# Linear Representation of a gene with sgRNA distribution

![example display](https://github.com/sophielem/linear_card/docs/example.png)

## Usage
Pour utiliser ce composant, il est nécessaire de lui transmettre deux informations à l'aide des propriétés : **all_sgrna** et **gene**.

#### all_sgrna
A string in JSON format, with the sgRNA as key and a list of coordinates as values. This list must match the regex :
      __[+-]\\([0-9]\*,[0-9]\*\\)__ .
```JSON
{ "AAAGGTACTCCGGGGATAACAGG":["+(3343404,3343426)","+(4024637,4024659)","+(4270051,4270073)","+(4361123,4361145)","+(4466866,4466888)","-(255252,255274)","-(842752,842774)"],
  "AACGGATAAAAGGTACTCCGGGG":["+(3343412,3343434)","+(4024645,4024667)","+(4270059,4270081)","+(4361131,4361153)","+(4466874,4466896)","-(255244,255266)","-(842744,842766)"],
  "ATGTCGGCTCATCACATCCTGGG":["+(3343334,3343356)","+(4024567,4024589)","+(4269981,4270003)","+(4361053,4361075)","+(4466796,4466818)","-(255322,255344)","-(842822,842844)"],
  "ACCTTTTATCCGTTGAGCGATGG":["+(255235,255257)","+(842735,842757)","-(3343421,3343443)","-(4024654,4024676)","-(4270068,4270090)","-(4361140,4361162)","-(4466883,4466905)"]}
```

#### gene
A string in JSON format, a list of dictionary with *start* and *end* as key and coordinates as values.
```JSON
[{"start":"255180","end":"255599"},{"start":"842680","end":"843099"},{"start":"3343077","end":"3343496"},{"start":"4024310","end":"4024729"},{"start":"4269724","end":"4270143"},{"start":"4360796","end":"4361215"},{"start":"4466539","end":"4466958"}]
```

#### width_bar
*default : 90%* <br/>
Need a percentage for the width of the bar which represents the gene.

#### nb_step
*default : 20* <br/>
The number of bar in histogram.

#### width_div
*default : screen.width* <br/>
If the component is under a div, give the width of the div to calculate the width of the histogram according to the width of the bar.

## Event
None

## Authors
Sophie LEMATRE

## Date
July 17 2019
