import { defineStore } from 'pinia';

export const regionsMap = {
  'North': ['chiangmai', 'chiangrai', 'lampang', 'lamphun', 'maehongson', 'nan', 'phayao', 'phrae', 'uttaradit'],
  'Northeast': ['amnatcharoen', 'buengkan', 'buriram', 'chaiyaphum', 'kalasin', 'khonkaen', 'loei', 'mahasarakham', 'mukdahan', 'nakhonphanom', 'nakhonratchasima', 'nongbualamphu', 'nongkhai', 'roiet', 'sakonnakhon', 'sisaket', 'surin', 'ubonratchathani', 'udonthani', 'yasothon'],
  'Central': ['angthong', 'phranakhonsiayutthaya', 'ayutthaya', 'krungthepmahanakhon', 'bangkok', 'chainat', 'kamphaengphet', 'lopburi', 'nakhonnayok', 'nakhonpathom', 'nakhonsawan', 'nonthaburi', 'pathumthani', 'phetchabun', 'phichit', 'phitsanulok', 'samutprakan', 'samutsakhon', 'samutsongkhram', 'saraburi', 'singburi', 'sukhothai', 'suphanburi', 'uthaithani'],
  'East': ['chachoengsao', 'chanthaburi', 'chonburi', 'prachinburi', 'rayong', 'sakaeo', 'trat'],
  'West': ['kanchanaburi', 'phetchaburi', 'prachuapkhirikhan', 'ratchaburi', 'tak'],
  'South': ['chumphon', 'krabi', 'nakhonsithammarat', 'narathiwat', 'pattani', 'phangnga', 'phatthalung', 'phuket', 'ranong', 'satun', 'songkhla', 'suratthani', 'trang', 'yala']
};

export const englishProvinces = [
  "Amnat Charoen", "Ang Thong", "Bangkok Metropolis", "Bueng Kan", "Buri Ram", "Chachoengsao",
  "Chai Nat", "Chaiyaphum", "Chanthaburi", "Chiang Mai", "Chiang Rai", "Chon Buri",
  "Chumphon", "Kalasin", "Kamphaeng Phet", "Kanchanaburi", "Khon Kaen", "Krabi",
  "Lampang", "Lamphun", "Loei", "Lop Buri", "Mae Hong Son", "Maha Sarakham",
  "Mukdahan", "Nakhon Nayok", "Nakhon Pathom", "Nakhon Phanom", "Nakhon Ratchasima",
  "Nakhon Sawan", "Nakhon Si Thammarat", "Nan", "Narathiwat", "Nong Bua Lam Phu",
  "Nong Khai", "Nonthaburi", "Pathum Thani", "Pattani", "Phangnga", "Phatthalung",
  "Phayao", "Phetchabun", "Phetchaburi", "Phichit", "Phitsanulok", "Phra Nakhon Si Ayutthaya",
  "Phrae", "Phuket", "Prachin Buri", "Prachuap Khiri Khan", "Ranong", "Ratchaburi",
  "Rayong", "Roi Et", "Sa Kaeo", "Sakon Nakhon", "Samut Prakan", "Samut Sakhon",
  "Samut Songkhram", "Saraburi", "Satun", "Sing Buri", "Si Sa Ket", "Songkhla",
  "Sukhothai", "Suphan Buri", "Surat Thani", "Surin", "Tak", "Trang", "Trat",
  "Ubon Ratchathani", "Udon Thani", "Uthai Thani", "Uttaradit", "Yala", "Yasothon"
].sort((a, b) => a.localeCompare(b));

export const useMapStore = defineStore('map', {
    state: () => ({
        selectedRegion: 'All', // "All", "North", "South", or "Chiang Mai"
        hoveredLocation: null, // { type: 'region' | 'province', name: String }
    }),
    actions: {
        setSelectedRegion(val) {
            this.selectedRegion = val;
        },
        setHoveredLocation(type, name) {
            if (!type || !name) {
                this.hoveredLocation = null;
            } else {
                this.hoveredLocation = { type, name };
            }
        },
        clearHoveredLocation() {
            this.hoveredLocation = null;
        }
    }
});
