import { IUser } from 'src/modules/users/interface/user.interface';

function maskCPF(cpf: string): string {
  return `${cpf.substr(0, 3)}.XXX.XXX-${cpf.substr(-2)}`;
}

function maskEmail(email: string): string {
  const [username, domain] = email.split('@');
  const maskedUsername =
    username.slice(0, 1) + '*'.repeat(username.length - 2) + username.slice(-1);
  return `${maskedUsername}@${domain}`;
}

function maskPhone(phone: string): string {
  const maskedPhone =
    phone.substr(0, phone.length - 8) + '****-**' + phone.substr(-2);
  return maskedPhone;
}
export const maskedUser = (user: IUser) => {
  return {
    cpf: maskCPF(user.document),
    name: user.name.split(' ')[0],
    contact: {
      emailAddress: maskEmail(user.contact.emailAddress),
      ddd: user.contact.ddd,
      phone: maskPhone(user.contact.phone),
    },
  };
};
