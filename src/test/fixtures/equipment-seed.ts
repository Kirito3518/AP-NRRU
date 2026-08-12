export type EquipmentStatus =
  | "ACTIVE"
  | "PROBLEM"
  | "MAINTENANCE"
  | "MOVED"
  | "MISSING"
  | "RETIRED";

export type EquipmentSeedRow = {
  systemCode: string;
  department: string | null;
  building: string | null;
  floor: string | null;
  location: string | null;
  category: string | null;
  deviceType: string | null;
  serialNumber: string | null;
  receivedYear: string | null;
  budgetSource: string | null;
  owner: string | null;
  cpu: string | null;
  ram: string | null;
  storage: string | null;
  operatingSystem: string | null;
  ipAddress: string | null;
  macAddress: string | null;
  networkSpeed: string | null;
  connectionStatus: string | null;
  condition: string | null;
  approximateAge: string | null;
  problem: string | null;
  note: string | null;
  status: EquipmentStatus;
};

type SourceRow = [
  number,
  string,
  string,
  number,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

const sourceRows: SourceRow[] = [
  [1,"คณะวิทยาศาตร์และเทคโนโลยี","อาคาร32",1,"บนเพดานชั้นที่1","ครุภัณฑ์คอมพิวเตอร์ ","Wireless Access Point Cisco Arionet 1140","-","-","-","สำนักคอมพิวเตอร์","Integrated Network Processor","128MB","32MB","Cisco IOS","10.106.110.63","A0:F8:49:EB:CD:0F","1 Gbps (LAN)","ปกติ","ดีมาก","-","-","-"],
  [2,"คณะวิทยาศาตร์และเทคโนโลยี","อาคาร32",1,"บนเพดานชั้นที่1","ครุภัณฑ์คอมพิวเตอร์ ","Wireless Access Point Cisco Arionet 1140","-","-","-","สำนักคอมพิวเตอร์","Integrated Network Processor","128MB","32MB","Cisco IOS","10.106.110.63","00:78:88:36:6D:FF","1 Gbps (LAN)","ปกติ","ดีมาก","-","-","-"],
  [3,"คณะวิทยาศาตร์และเทคโนโลยี","อาคาร32",1,"บนเพดานชั้นที่1","ครุภัณฑ์คอมพิวเตอร์ ","Wireless Access Point Cisco Arionet 1140","-","-","-","สำนักคอมพิวเตอร์","Integrated Network Processor","128MB","32MB","Cisco IOS","10.106.110.63","00:3C:10:73:AB:8F","1 Gbps (LAN)","ปกติ","ดีมาก","-","-","-"],
  [4,"คณะวิทยาศาตร์และเทคโนโลยี","อาคาร32",1,"บนเพดานชั้นที่1","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","อุปกรณ์สูญหาย","-"],
  [5,"คณะวิทยาศาตร์และเทคโนโลยี","อาคาร32",1,"บนเพดานชั้นที่1","ครุภัณฑ์คอมพิวเตอร์ ","Wireless Access Point Cisco Arionet 1600","-","-","-","สำนักคอมพิวเตอร์","-","256MB","32MB","Cisco IOS","10.106.110.63","54:7C:69:71:13:AE","1 Gbps (LAN)","ปกติ","ดีมาก","-","-","-"],
  [6,"คณะวิทยาศาตร์และเทคโนโลยี","อาคาร32",1,"บนเพดานชั้นที่1","ครุภัณฑ์คอมพิวเตอร์ ","Wireless Access Point Cisco Arionet 1600","-","-","-","สำนักคอมพิวเตอร์","-","256MB","32MB","Cisco IOS","10.106.110.63","74:A0:2F:E1:38:CE","1 Gbps (LAN)","ปกติ","ดีมาก","-","-","-"],
  [7,"คณะวิทยาศาตร์และเทคโนโลยี","อาคาร32",1,"บนเพดานชั้นที่1","ครุภัณฑ์คอมพิวเตอร์ ","Wireless Access Point Cisco Arionet 1600","-","-","-","สำนักคอมพิวเตอร์","-","256MB","32MB","Cisco IOS","10.106.110.63","00:57:D2:A9:B3:6E","1 Gbps (LAN)","ปกติ","ดีมาก","-","-","-"],
  [8,"คณะวิทยาศาตร์และเทคโนโลยี","อาคาร32",1,"บนเพดานชั้นที่1","ครุภัณฑ์คอมพิวเตอร์ ","Wireless Access Point Cisco Arionet 1600","-","-","-","สำนักคอมพิวเตอร์","-","256MB","32MB","Cisco IOS","10.106.110.63","F0:78:16:3C:35:CE","1 Gbps (LAN)","ปกติ","ดีมาก","-","-","-"],
  [9,"คณะวิทยาศาตร์และเทคโนโลยี","อาคาร32",1,"บนเพดานชั้นที่1","ครุภัณฑ์คอมพิวเตอร์ ","Wireless Access Point Cisco Arionet 1600","-","-","-","สำนักคอมพิวเตอร์","-","256MB","32MB","Cisco IOS","10.106.110.63","DC:EB:94:BF:49:EE","1 Gbps (LAN)","ปกติ","ดีมาก","-","-","-"],
  [10,"คณะวิทยาศาตร์และเทคโนโลยี","อาคาร32",1,"บนเพดานชั้นที่1","ครุภัณฑ์คอมพิวเตอร์ ","Wireless Access Point Cisco Arionet 1600","-","-","-","สำนักคอมพิวเตอร์","-","256MB","32MB","Cisco IOS","10.106.110.63","F4:1F:C2:BB:4A:8E","1 Gbps (LAN)","ปกติ","ดีมาก","-","-","-"],
  [11,"คณะวิทยาศาตร์และเทคโนโลยี","อาคาร32",1,"บนเพดานชั้นที่1","ครุภัณฑ์คอมพิวเตอร์ ","Wireless Access Point Cisco Arionet 1600","-","-","-","สำนักคอมพิวเตอร์","-","256MB","32MB","Cisco IOS","10.106.110.63","F8:C2:88:84:09:7E","1 Gbps (LAN)","ปกติ","ดีมาก","-","-","-"],
  [12,"คณะวิทยาศาตร์และเทคโนโลยี","อาคาร32",1,"บนเพดานชั้นที่1","ครุภัณฑ์คอมพิวเตอร์ ","Wireless Access Point Cisco Arionet 1600","-","-","-","สำนักคอมพิวเตอร์","-","256MB","32MB","Cisco IOS","10.106.110.63","CC:16:7E:A2:A3:2E","1 Gbps (LAN)","ปกติ","ดีมาก","-","-","-"],
  [13,"คณะวิทยาศาตร์และเทคโนโลยี","อาคาร32",1,"บนเพดานชั้นที่1","ครุภัณฑ์คอมพิวเตอร์ ","Wireless Access Point Aruba AP-505","-","-","-","สำนักคอมพิวเตอร์","Dual-Core ARM Cortex-A53","512MB","256MB","ArubaOS","10.106.110.63","48:B4:C3:45:DD:50","1 Gbps (LAN)","ปกติ","ดีมาก","-","-","-"],
  [14,"คณะวิทยาศาตร์และเทคโนโลยี","อาคาร33",1,"บนเพดานชั้นที่1","ครุภัณฑ์คอมพิวเตอร์ ","Wireless Access Point Aruba AP-505","-","-","-","สำนักคอมพิวเตอร์","Dual-Core ARM Cortex-A54","512MB","256MB","ArubaOS","10.106.110.63","48:B4:C3:45:42:F0","1 Gbps (LAN)","ปกติ","ดีมาก","-","-","-"],
  [15,"คณะวิทยาศาตร์และเทคโนโลยี","อาคาร32",2,"บนเพดานชั้นที่2","ครุภัณฑ์คอมพิวเตอร์ ","Wireless Access Point      TP-Link Omada","-","-","-","สำนักคอมพิวเตอร์","Qualcomm","128MB","32MB","TP-Link Omada OS","10.109.0.251","5A:AF:97:C2:69:65","1 Gbps (LAN)","ปกติ","ดีมาก","-","-","-"],
  [16,"คณะวิทยาศาตร์และเทคโนโลยี","อาคาร32",3,"บนเพดานชั้นที่3","ครุภัณฑ์คอมพิวเตอร์ ","Wireless Access Point      TP-Link Omada","-","-","-","สำนักคอมพิวเตอร์","Qualcomm","128MB","32MB","TP-Link Omada OS","10.109.0.251","5A:AF:97:C2:75:59","1 Gbps (LAN)","ปกติ","ดีมาก","-","-","-"],
  [17,"คณะวิทยาศาตร์และเทคโนโลยี","อาคาร32",3,"บนเพดานชั้นที่3","ครุภัณฑ์คอมพิวเตอร์ ","Wireless Access Point      TP-Link Omada","-","-","-","สำนักคอมพิวเตอร์","Qualcomm","128MB","32MB","TP-Link Omada OS","10.109.0.251","2C:D0:2D:DB:F3:6D","1 Gbps (LAN)","ปกติ","ดีมาก","-","-","-"],
  [18,"คณะวิทยาศาตร์และเทคโนโลยี","อาคาร32",4,"บนเพดานชั้นที่4","ครุภัณฑ์คอมพิวเตอร์ ","Wireless Access Point      Cisco Aironet 1852E Series","-","-","-","สำนักคอมพิวเตอร์","Dual-Core","1GB","256MB","Cisco IOS","10.109.0.251","2C:D0:2D:DB:F3:6D","1 Gbps (LAN)","ปกติ","ดีมาก","-","-","-"],
  [19,"คณะวิทยาศาตร์และเทคโนโลยี","อาคาร32",4,"บนเพดานชั้นที่4","ครุภัณฑ์คอมพิวเตอร์ ","Wireless Access Point      Cisco Aironet 1852I Series","KWC2228062X","-","-","สำนักคอมพิวเตอร์","Dual-Core","1GB","256MB","Cisco IOS","10.109.0.251","00:DF:1D:6B:84:4D","1 Gbps (LAN)","ปกติ","ดีมาก","-","-","-"],
  [20,"คณะวิทยาศาตร์และเทคโนโลยี","อาคาร32",5,"บนเพดานชั้นที่5","ครุภัณฑ์คอมพิวเตอร์ ","Wireless Access Point      Cisco Aironet 1852E Series","-","-","-","สำนักคอมพิวเตอร์","Dual-Core","1GB","256MB","Cisco IOS","10.109.0.251","2C:D0:2D:F9:C6:ED","1 Gbps (LAN)","ปกติ","ดีมาก","-","-","-"],
  [21,"คณะวิทยาศาตร์และเทคโนโลยี","อาคาร32",5,"บนเพดานชั้นที่5","ครุภัณฑ์คอมพิวเตอร์ ","Wireless Access Point      Cisco Aironet 1852E Series","-","-","-","สำนักคอมพิวเตอร์","Dual-Core","1GB","256MB","Cisco IOS","10.109.0.251","2C:D0:2D:E0:CB:CD","1 Gbps (LAN)","ปกติ","ดีมาก","-","-","-"],
  [22,"คณะวิทยาศาตร์และเทคโนโลยี","อาคาร32",5,"ด้านข้างกำแพงระหว่างห้อง5และห้อง6ชั้นที่5","ครุภัณฑ์คอมพิวเตอร์ ","Wireless Access Point      TP-Link Archer AX 10","-","-","-","สำนักคอมพิวเตอร์","Triple-Core","256MB","16MB","TP-Link Router Firmware","10.109.0.251","5E:AF:97:C2:69:E3","1 Gbps (LAN)","แย่","สัญญาณอ่อน","-","-","-"],
  [23,"คณะวิทยาศาตร์และเทคโนโลยี","อาคาร32",6,"บนเพดานชั้นที่6","ครุภัณฑ์คอมพิวเตอร์ ","Wireless Access Point      EnGenius EAP Series","-","-","-","สำนักคอมพิวเตอร์","Qualcomm","32MB","4MB","EnGenius Firmware","10.109.0.251","5A:AF:97:C2:69:E3","1 Gbps (LAN)","ปกติ","ดีมาก","-","-","-"],
  [24,"คณะวิทยาศาตร์และเทคโนโลยี","อาคาร32",7,"บนเพดานชั้นที่7","ครุภัณฑ์คอมพิวเตอร์ ","Wireless Access Point      TP-Link Omada","-","-","-","สำนักคอมพิวเตอร์","Qualcomm","128MB","32MB","TP-Link Omada OS","10.109.0.251","5A:AF:97:C2:78:95","1 Gbps (LAN)","ปกติ","ดีมาก","-","-","-"],
  [25,"คณะวิทยาศาตร์และเทคโนโลยี","อาคาร32",7,"บนเพดานชั้นที่7","ครุภัณฑ์คอมพิวเตอร์ ","Wireless Access Point      TP-Link Omada","-","-","-","สำนักคอมพิวเตอร์","Qualcomm","128MB","32MB","TP-Link Omada OS","10.109.0.251","5A:AF:97:C2:78:81","1 Gbps (LAN)","ปกติ","ดีมาก","-","-","-"],
  [26,"คณะวิทยาศาตร์และเทคโนโลยี","อาคาร32",7,"บนเพดานชั้นที่7","ครุภัณฑ์คอมพิวเตอร์ ","Wireless Access Point      TP-Link Omada","-","-","-","สำนักคอมพิวเตอร์","Qualcomm","128MB","32MB","TP-Link Omada OS","10.109.0.251","5A:AF:97:C2:77:8D","1 Gbps (LAN)","ปกติ","ดีมาก","-","-","-"],
  [27,"คณะวิทยาศาตร์และเทคโนโลยี","อาคาร32",8,"บนเพดานห้องโถงใหญ่ชั้นที่8","ครุภัณฑ์คอมพิวเตอร์ ","Wireless Access Point      Cisco Aironet 1852E Series","-","-","-","สำนักคอมพิวเตอร์","Dual-Core","1GB","256MB","Cisco IOS","10.109.0.251","2C:D0:2D:F9:D0:CD","1 Gbps (LAN)","ปกติ","ดีมาก","-","-","-"],
  [28,"คณะวิทยาศาตร์และเทคโนโลยี","อาคาร32",8,"บนเพดานห้องโถงใหญ่ชั้นที่8","ครุภัณฑ์คอมพิวเตอร์ ","Wireless Access Point      Cisco Aironet 1852E Series","-","-","-","สำนักคอมพิวเตอร์","Dual-Core","1GB","256MB","Cisco IOS","10.109.0.251","2C:D0:2D:DB:FC:4D","1 Gbps (LAN)","ปกติ","ดีมาก","-","-","-"],
  [29,"คณะวิทยาศาตร์และเทคโนโลยี","อาคาร32",8,"บนเพดานห้องโถงใหญ่ชั้นที่8","ครุภัณฑ์คอมพิวเตอร์ ","Wireless Access Point      Cisco Aironet 1852E Series","-","-","-","สำนักคอมพิวเตอร์","Dual-Core","1GB","256MB","Cisco IOS","10.109.0.251","2C:D0:2D:E0:CD:8D","1 Gbps (LAN)","ปกติ","ดีมาก","-","-","-"],
  [30,"คณะวิทยาศาตร์และเทคโนโลยี","อาคาร32",8,"บนเพดานห้องโถงใหญ่ชั้นที่8","ครุภัณฑ์คอมพิวเตอร์ ","Wireless Access Point      Cisco Aironet 1852E Series","-","-","-","สำนักคอมพิวเตอร์","Dual-Core","1GB","256MB","Cisco IOS","10.109.0.251","2C:D0:2D:E0:CD:2D","1 Gbps (LAN)","ปกติ","ดีมาก","-","-","-"],
];

function value(input: string | number): string | null {
  const normalized = String(input).trim().replace(/\s+/g, " ");
  return normalized === "-" ? null : normalized;
}

export const equipmentSeedRows: EquipmentSeedRow[] = sourceRows.map((row) => ({
  systemCode: `NRRU-EQ-${String(row[0]).padStart(4, "0")}`,
  department: value(row[1]),
  building: value(row[2]),
  floor: value(row[3]),
  location: value(row[4]),
  category: value(row[5]),
  deviceType: value(row[6]),
  serialNumber: value(row[7]),
  receivedYear: value(row[8]),
  budgetSource: value(row[9]),
  owner: value(row[10]),
  cpu: value(row[11]),
  ram: value(row[12]),
  storage: value(row[13]),
  operatingSystem: value(row[14]),
  ipAddress: value(row[15]),
  macAddress: value(row[16]),
  networkSpeed: value(row[17]),
  connectionStatus: value(row[18]),
  condition: value(row[19]),
  approximateAge: value(row[20]),
  problem: value(row[21]),
  note: value(row[22]),
  status: row[21].includes("สูญหาย")
    ? "MISSING"
    : row[18] === "แย่" || row[19].includes("สัญญาณอ่อน")
      ? "PROBLEM"
      : "ACTIVE",
}));
