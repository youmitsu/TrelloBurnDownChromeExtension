//データのラベルや色などの設定を行う
export function setConfigData(json, index, label, backgroundColor, borderColor, pointColor) {
  json.datasets[index].label = label;
  json.datasets[index].backgroundColor = backgroundColor;
  json.datasets[index].pointBackgroundColor = pointColor;
  json.datasets[index].fill = true;
  json.datasets[index].borderColor = borderColor;
}
