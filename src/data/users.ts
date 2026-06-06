// Mock users & shareable files (no backend yet).

export interface User {
  id: number
  firstName: string
  lastName: string
  name: string
  avatar: string // initials
  role: string
  school?: string
  email: string
  phone: string
  location: string
  subject?: string
  level?: string
  online?: boolean
}

/** The signed-in replacement (used across Dashboard, Settings, Messages…). */
export const currentUser: User = {
  id: 0,
  firstName: 'Marc',
  lastName: 'Renaud',
  name: 'Marc Renaud',
  avatar: 'MR',
  role: 'Remplaçant·e',
  email: 'marc.renaud@exemple.ch',
  phone: '+41 79 123 45 67',
  location: 'Lausanne, VD',
}

/** Teacher contacts the replacement chats with. */
export const contacts: User[] = [
  { id: 1, firstName: 'Sophie', lastName: 'Ducret', name: 'Sophie Ducret', avatar: 'SD', role: 'Enseignante titulaire', school: 'EP Belmont', email: 'sophie.ducret@edu-vd.ch', phone: '+41 21 555 12 34', location: 'Belmont-sur-Lausanne, VD', subject: 'Français', level: '5-6P', online: true },
  { id: 2, firstName: 'Jean-Marc', lastName: 'Favre', name: 'Jean-Marc Favre', avatar: 'JF', role: 'Enseignant titulaire', school: "Collège de l'Elysée", email: 'jm.favre@edu-vd.ch', phone: '+41 22 555 88 21', location: 'Lausanne, VD', subject: 'Mathématiques', level: '9-11S · VP', online: false },
  { id: 3, firstName: 'Claire', lastName: 'Monnier', name: 'Claire Monnier', avatar: 'CM', role: 'Enseignante titulaire', school: 'EP des Jordils', email: 'claire.monnier@edu-vd.ch', phone: '+41 21 555 47 09', location: 'Pully, VD', subject: 'Sciences de la nature', level: '7-8P', online: true },
]

/** Pool of replacements a secretariat can evaluate / consult. */
export const replacements: User[] = [
  { id: 101, firstName: 'Marc', lastName: 'Renaud', name: 'Marc Renaud', avatar: 'MR', role: 'Remplaçant·e', email: 'marc.renaud@exemple.ch', phone: '+41 79 123 45 67', location: 'Lausanne, VD', subject: 'Français · Maths', level: '5-8P' },
  { id: 102, firstName: 'Léa', lastName: 'Brunner', name: 'Léa Brunner', avatar: 'LB', role: 'Remplaçante', email: 'lea.brunner@exemple.ch', phone: '+41 79 222 33 44', location: 'Morges, VD', subject: 'Allemand · Anglais', level: '7-8P · 9-11S' },
  { id: 103, firstName: 'Thomas', lastName: 'Aebischer', name: 'Thomas Aebischer', avatar: 'TA', role: 'Remplaçant', email: 'thomas.aebischer@exemple.ch', phone: '+41 79 555 66 77', location: 'Yverdon, VD', subject: 'Sciences · Maths', level: '9-11S · VP' },
  { id: 104, firstName: 'Nadia', lastName: 'Khan', name: 'Nadia Khan', avatar: 'NK', role: 'Remplaçante', email: 'nadia.khan@exemple.ch', phone: '+41 79 888 99 00', location: 'Nyon, VD', subject: 'Enseignement généraliste', level: '1-4P' },
]

export interface SharedFile {
  name: string
  size: string
  url: string
}

/** Documents shared by the establishment (teacher -> replacement). */
export const transmissionDocs: SharedFile[] = [
  { name: 'Programme_Semaine_15-19_Sept.pdf', size: '80 KB', url: '/docs/programme-semaine.pdf' },
  { name: 'Plan_de_Classe_5P.pdf', size: '68 KB', url: '/docs/plan-de-classe.pdf' },
  { name: 'Exercices_Français_Lecture.pdf', size: '70 KB', url: '/docs/exercices-lecture.pdf' },
]

/** The replacement's own documents, available to share in a chat. */
export const shareableFiles: SharedFile[] = [
  { name: 'CV_Marc_Renaud.pdf', size: '73 KB', url: '/docs/cv-marc-renaud.pdf' },
  { name: 'Diplôme_HEP.pdf', size: '63 KB', url: '/docs/diplome-hep.pdf' },
  { name: 'Mes_disponibilités.pdf', size: '66 KB', url: '/docs/disponibilites.pdf' },
]
