"use client";

import { Workbook, type CellValue } from "exceljs";

type ObjectSheet = {
  kind: "object";
  name: string;
  columns: string[];
  rows: Array<Record<string, unknown>>;
};

type MatrixSheet = {
  kind: "matrix";
  name: string;
  rows: string[][];
};

type WorkbookSheet = ObjectSheet | MatrixSheet;

function cellValueToString(value: CellValue | undefined | null): string {
  if (value == null) {
    return "";
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value).trim();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value.richText)) {
    return value.richText.map((part) => part.text).join("").trim();
  }

  if ("text" in value && typeof value.text === "string") {
    return value.text.trim();
  }

  if ("hyperlink" in value && typeof value.hyperlink === "string") {
    return value.hyperlink.trim();
  }

  if ("formula" in value) {
    if (value.result == null) {
      return "";
    }

    return String(value.result).trim();
  }

  return "";
}

function triggerDownload(buffer: ArrayBuffer, filename: string) {
  const blob = new Blob(
    [buffer],
    {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

export async function downloadWorkbook(
  filename: string,
  sheets: WorkbookSheet[],
) {
  const workbook = new Workbook();

  sheets.forEach((sheet) => {
    const worksheet = workbook.addWorksheet(sheet.name);

    if (sheet.kind === "object") {
      worksheet.columns = sheet.columns.map((column) => ({
        header: column,
        key: column,
      }));

      sheet.rows.forEach((row) => {
        worksheet.addRow(
          Object.fromEntries(
            sheet.columns.map((column) => [column, row[column] ?? ""]),
          ),
        );
      });

      return;
    }

    sheet.rows.forEach((row) => {
      worksheet.addRow(row);
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  triggerDownload(buffer, filename);
}

export async function readFirstWorksheet(file: File) {
  const workbook = new Workbook();
  const buffer = await file.arrayBuffer();

  await workbook.xlsx.load(buffer);

  const worksheet = workbook.worksheets[0];

  if (!worksheet) {
    throw new Error("The uploaded workbook does not contain any sheets.");
  }

  const headerRow = worksheet
    .getRow(1)
    .values
    .slice(1)
    .map((value) => cellValueToString(value as CellValue));

  const rows: Record<string, unknown>[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      return;
    }

    const values = row.values.slice(1).map((value) => cellValueToString(value as CellValue));
    const hasContent = values.some((value) => value !== "");

    if (!hasContent) {
      return;
    }

    rows.push(
      Object.fromEntries(
        headerRow.map((header, index) => [header, values[index] ?? ""]),
      ),
    );
  });

  return { headerRow, rows };
}
