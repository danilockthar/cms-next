export const getDateNow = () => {
  let date = new Date();
  let year = date.getFullYear();
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let day = date.getDate();
  if (day <= 9) {
    day = "0" + day;
  }
  const fecha = `${year}-${month}-${day}`;
  return fecha;
};
