import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

const BORDER_COLOR = "#2C2E33";
const BORDER_STYLE = "solid";

const StatementPdf = () => {
  const dataList = [
    {
      agent_no: "AQM123",
      payee_name: "Abhay Kumar",
      commission_date: "12-Sep-2024",
    },
  ];

  const dataListBalance = [
    {
      col_1: "Group",
      col_2: "-",
    },
    {
      col_1: "Group",
      col_2: "-",
    },
    {
      col_1: "Advance Adjustment",
      col_2: "$500.00",
    },
    {
      col_1: "Net Calculated Commission",
      col_2: "$6000.00",
    },
    {
      col_1: "Amount Paid",
      col_2: "$8000.00",
    },
  ];

  const styles = StyleSheet.create({
    page: {
      //   flexDirection: 'row',
      backgroundColor: "#FFFFFF",
      overflow: "hidden",
      position: "relative",
      width: "100%",
      paddingBottom: "99px",
      paddingTop: "90x",
    },
    section: {
      position: "absolute",
      left: "45.5%",
      top: 35,
      width: "100%",
    },
    image: {
      width: 60,
      height: 50,
    },
    cornerPage: {
      height: 59.76,
      width: 97.16,
      position: "absolute",
      borderBottom: "2px solid #5C5F66",
      paddingBottom: "4px",
      transform: "rotate(-45.55deg)",
      top: -15,
      left: -34.6,
    },
    cornerPageBottom: {
      height: 59.76,
      width: 97.16,
      position: "absolute",
      borderTop: "2px solid #5C5F66",
      paddingTop: "4px",
      transform: "rotate(-45.55deg)",
      bottom: -15,
      right: -34.6,
    },
    title: {
      fontSize: 16,
      color: "#1C7ED6",
      textAlign: "center",
      fontWeight: 800,
    },
    table: {
      //   display: 'table',
      width: "auto",
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0,
      marginLeft: "15px",
      marginRight: "15px",
    },
    tableRow: {
      margin: "auto",
      flexDirection: "row",
    },

    tableCellHeader: {
      marginLeft: "15px",
      marginRight: "15px",
      marginTop: "8px",
      marginBottom: "7px",
      fontSize: "10px",
      fontWeight: "normal",
      color: "#2C2E33",
    },
    tableCell: {
      margin: 2,
      fontSize: 10,
      marginLeft: "15px",
      marginRight: "15px",
      marginTop: "8px",
      marginBottom: "7px",
      fontWeight: 600,
    },
    headerBg: {
      backgroundColor: "#fff",
    },
    textCenter: {
      textAlign: "center",
    },
    tableCol: {
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableHeading: {
      marginLeft: "15px",
      marginRight: "15px",
      marginTop: "8px",
      marginBottom: "7px",
      fontSize: "12px",
      fontWeight: 600,
      color: "#2C2E33",
    },
    tableHeading400: {
      marginTop: "8px",
      marginBottom: "7px",
      fontSize: "12px",
      fontWeight: 400,
      color: "#2C2E33",
    },
    pageNumber: {
      position: "absolute",
      fontSize: 12,
      bottom: 11,
      right: 11,
      textAlign: "center",
      color: "white",
      fontWeight: 600,
    },
  });

  return (
    <>
      <Document>
        <Page wrap size={"A4"} style={styles.page}>
          <View fixed style={styles.cornerPage}>
            <View
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#1C7ED6",
              }}
            >
              <Text />
            </View>
          </View>

          <View fixed style={styles.section}>
            <Image  style={styles.image} src={"/OpenAI.png"} />
          </View>

          <Text style={styles.title}>Abhay Pdf Generation work</Text>

          <View style={[styles.table, { marginTop: "15px" }]}>
            <View style={[styles.tableCol, { width: "100%" }]}>
              <Text style={[styles.tableHeading, { textAlign: "center" }]}>
                Commission Statement
              </Text>
            </View>
            <View style={[styles.tableRow, styles.headerBg]}>
              {fields.map((item) => (
                <View
                  key={item.title}
                  style={[styles.tableCol, { width: `${item.width}%` }]}
                >
                  <Text style={[styles.tableCellHeader, { textAlign: "left" }]}>
                    {item.title}
                  </Text>
                </View>
              ))}
            </View>
            {dataList.map((items) => (
              <View key={items.agent_no} style={styles.tableRow}>
                {fields.map((item) => {
                  return (
                    <View
                      key={item.title}
                      style={[styles.tableCol, { width: `${item.width}%` }]}
                    >
                      <Text style={[styles.tableCell]}>
                        {item.component(items)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
          {/* Balance */}
          <View style={[styles.table, { marginTop: "10px" }]}>
            <View style={[styles.tableCol, { width: "100%" }]}>
              <Text style={[styles.tableHeading, { textAlign: "center" }]}>
                Balance
              </Text>
            </View>
            {dataListBalance.map((items) => (
              <View key={items.col_1} style={styles.tableRow}>
                {fieldsBalance.map((item) => {
                  return (
                    <View
                      key={item.title}
                      style={[styles.tableCol, { width: `${item.width}%` }]}
                    >
                      <Text
                        style={[
                          {
                            marginLeft: "15px",
                            marginRight: "15px",
                            marginTop: "5px",
                            marginBottom: "5px",
                            fontSize: "10px",
                            color: "#2C2E33",
                          },
                          { fontWeight: item.fontWeight },
                        ]}
                      >
                        {item.component(items)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
          {/* File Label : El13U U65 May 2023 */}

          <View style={[styles.table, { marginTop: "10px" }]}>
            <View
              style={[
                styles.tableCol,
                {
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 0,
                },
              ]}
            >
              <Text style={[styles.tableHeading, { textAlign: "center" }]}>
                File Label :
              </Text>
              <Text style={[styles.tableHeading400, { textAlign: "center" }]}>
                Level Sep 2024
              </Text>
            </View>
            <View style={[styles.tableRow, styles.headerBg]}>
              {fieldFileLabel1.map((item) => (
                <View
                  key={item.title}
                  style={[styles.tableCol, { width: `${item.width}%` }]}
                >
                  <Text
                    style={[
                      {
                        fontSize: "8px",
                        fontWeight: 500,
                        padding: "5px",
                        color: "#2C2E33",
                      },
                    ]}
                  >
                    {item.title}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.tableRow}>
              {fieldFileLabel1.map((item) => {
                return (
                  <View
                    key={item.title}
                    style={[styles.tableCol, { width: `${item.width}%` }]}
                  >
                    <Text
                      style={[
                        {
                          fontSize: "8px",
                          fontWeight: 400,
                          padding: "5px",
                          color: "#2C2E33",
                        },
                      ]}
                    >
                      Abhay
                    </Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "90%" }]} />
              <View style={[styles.tableCol, { width: "10%" }]}>
                <Text
                  style={[
                    {
                      fontSize: "8px",
                      fontWeight: 500,
                      padding: "5px",
                      textAlign: "center",
                      color: "#2C2E33",
                    },
                  ]}
                >
                  $500.00
                </Text>
              </View>
            </View>
          </View>

          <View fixed style={styles.cornerPageBottom}>
            <View
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#1C7ED6",
                color: "#1C7ED6",
              }}
            >
              <Text />
            </View>
          </View>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber }) =>
              `${pageNumber < 10 ? `0${pageNumber}` : pageNumber}`
            }
            fixed
          />
          <Text
            fixed
            style={{
              position: "absolute",
              left: 15,
              bottom: 12,
              color: "#2C2E33",
              fontSize: "8px",
              fontWeight: 500
            }}
          >
            This statement reflects commissions earned. Thank you.
          </Text>
        </Page>
      </Document>
    </>
  );
};

export default StatementPdf;

const fields = [
  {
    title: "Payee Name",
    component: (item: { payee_name: string }) => `${item.payee_name}`,
    width: "34",
  },
  {
    title: "Agent No.",
    component: (item: { agent_no: string }) => `${item.agent_no}`,
    width: "33",
  },
  {
    title: "Compensation Date",
    component: (item: { commission_date: string }) => `${item.commission_date}`,
    width: "33",
  },
];

const fieldsBalance = [
  {
    title: "Col 1",
    component: (item: { col_1: string }) => `${item.col_1}`,
    width: "75",
    fontWeight: 400,
  },
  {
    title: "Col 2",
    component: (item: { col_2: string }) => `${item.col_2}`,
    width: "25",
    fontWeight: 500,
  },
];

const fieldFileLabel1 = [
  {
    title: "Customer Name",
    component: (item: { customer_name: string }) => `${item.customer_name}`,
    width: "12",
  },
  {
    title: "Contract Id",
    component: (item: { contract_id: string }) => `${item.contract_id}`,
    width: "11",
  },
  {
    title: "Cnt Mbr",
    component: (item: { member_count: string }) => `${item.member_count}`,
    width: "7",
  },
  {
    title: "Agent No.",
    component: (item: { agent_no: string }) => `${item.agent_no}`,
    width: "10",
  },
  {
    title: "Effective Date",
    component: (item: { effective_date: string }) => `${item.effective_date}`,
    width: "10",
  },
  {
    title: "Cancel Date",
    component: (item: { cancel_date: string }) => `${item.cancel_date}`,
    width: "10",
  },
  {
    title: "Commission level",
    component: (item: { commission_level: string }) =>
      `${item.commission_level}`,
    width: "12",
  },
  {
    title: "Sale Type",
    component: (item: { sale_type: string }) => `${item.sale_type}`,
    width: "9",
  },
  {
    title: "Product Name",
    component: (item: { product_name: string }) => `${item.product_name}`,
    width: "9",
  },
  {
    title: "Amount",
    component: (item: { amount: string }) => `${item.amount}`,
    width: "10",
  },
];
