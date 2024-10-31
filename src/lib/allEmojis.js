const allEmojis = [];

for (let i = 0x1F600; i <= 0x1F64F; i++) {
  allEmojis.push(String.fromCodePoint(i));
}

for (let i = 0x1F680; i <= 0x1F6FF; i++) {
  allEmojis.push(String.fromCodePoint(i));
}

for (let i = 0x2600; i <= 0x26FF; i++) {
  allEmojis.push(String.fromCodePoint(i));
}

for (let i = 0x2700; i <= 0x27BF; i++) {
  allEmojis.push(String.fromCodePoint(i));
}

export default allEmojis;