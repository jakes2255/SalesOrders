# 🧾 Sales Order Management App (SAP CAP + Fiori Elements)

A modern, cloud-ready application for managing Sales Orders using SAP's Cloud Application Programming Model (CAP) and SAP Fiori Elements.

---

## 📦 Technologies Used

- **SAP CAP (Cloud Application Programming Model)**  
  Robust framework to develop full-stack applications on SAP BTP.

- **SAP CDS (Core Data Services)**  
  Used to define the domain model and business logic.

- **SAP Fiori Elements**  
  Utilized for generating List Report and Object Page UIs automatically based on metadata.

- **SAP Business Application Studio (BAS)** or **VS Code**  
  Supported development environments for both backend and frontend.

- **SAP BTP (Business Technology Platform)**  
  Deployment target for the app, leveraging SAP-managed services like destinations and authentication.

- **OData V4**  
  Modern protocol for binding UI to backend services using CAP-generated services.

---

## 📁 Project Structure

```bash
sales-order-app/
├── app/                      # Fiori Elements UI project (List Report/Object Page)
├── db/                       # CDS data model (Entities, Projections, Annotations)
├── srv/                      # CAP service layer
├── package.json              # Project configuration
└── README.md                 # This file
