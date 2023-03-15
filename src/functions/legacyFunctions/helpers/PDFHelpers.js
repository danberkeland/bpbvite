import { PDFDocument } from "pdf-lib";

export const downloadPDF = async (pdfs, name) => {
    
    const mergedPdf = await PDFDocument.create();

    for (let pdf of pdfs){
      try{
        let pdfA = await PDFDocument.load(pdf);
      const copiedPagesA = await mergedPdf.copyPages(
        pdfA,
        pdfA.getPageIndices()
      );
      copiedPagesA.forEach((page) => mergedPdf.addPage(page));
      } catch {}
     
    }


    const mergedPdfFile = await mergedPdf.saveAsBase64({ dataUri: true});
           



    let pdf = mergedPdfFile.split("base64,")[1];
    
    const linkSource = `data:application/pdf;base64,${pdf}`;
    const downloadLink = document.createElement("a");
    const fileName = name;
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
    
  };