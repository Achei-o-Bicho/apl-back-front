export const gerarEndToEnd = () => {
  const randomChars = [...Array(4)]
    .map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26)))
    .join('');

  const dataHoraLocal = new Date()
    .toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
    .replace(/[^0-9]/g, '');

  const codigo = `REC${randomChars}${dataHoraLocal}`;

  return codigo;
};
