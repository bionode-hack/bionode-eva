# bionode-eva

European Variant Archive (EVA)
------------------------------

Hompage: http://www.ebi.ac.uk/eva/
API notes: https://github.com/ebivariation/eva/wiki

(The instructions below are for EVA but, according to the wiki, if the argument 'structural=true' is added to the intial queries DGVA is searched instead.)

Steps to metadata
-----------------

1: How do I find the set of (human) datasets that are available?

First list the Studies for human (also have to specify reference version but currently only grch37 returns results; there are none for grch38):-
http://www.ebi.ac.uk/eva/webservices/rest/v1/meta/studies/list?species=hsapiens_grch37
results in a list of (currently 13) studies:
https://github.com/bionode-hack/bionode-eva/blob/master/example_responses/studies_list_hsapiens_grch37.json

Within the 'result' value, iterate over the studies extracting 'studyId'.


2: How do I request information on an individual dataset (or maybe a batch of datasets)?

For each studyId, make two queries, the first to retrieve the summary (gives Title, Description, Assay Type and Technology) and the second to retrieve the list of files. The files are given as names but there is a further query that maps from file name to URL. Since we want only one URL per dataset, if there is only a single filename then use the URL for it but if there are multiple filenames then find the URL for the first one and truncate it to a directory name. (This worked in the examples I checked, i.e. the other files were under the same directory. A more robust solution might be to retrieve the URLs for all the filenames and find their longest common path.)

Using PRJEB4019 (1000 Genomes Phase 1) as an example:-

a) Retrieve the summary for PRJEB4019
http://www.ebi.ac.uk/eva/webservices/rest/v1/studies/PRJEB4019/summary

response: https://github.com/bionode-hack/bionode-eva/blob/master/example_responses/PRJEB4019_summary.json

b) Retrieve the (human) file list for PRJEB4019
http://www.ebi.ac.uk/eva/webservices/rest/v1/studies/PRJEB4019/files?species=hsapiens_grch37

response: https://github.com/bionode-hack/bionode-eva/blob/master/example_responses/PRJEB4019_files.json

c) Check whether there is more than one fileName within result. In this example there are 25 - one per chromosome - but in the case of PRJEB8661 (ExAC) there is only one. 

d) Retrieve the URL for the first fileName (ALL.chr5.integrated_phase1_v3.20101123.snps_indels_svs.genotypes.vcf.gz):
http://www.ebi.ac.uk/eva/webservices/rest/v1/files/ALL.chr5.integrated_phase1_v3.20101123.snps_indels_svs.genotypes.vcf.gz/url

response: https://github.com/bionode-hack/bionode-eva/blob/master/example_responses/ALL.chr5.integrated_phase1_v3.20101123.snps_indels_svs.genotypes.vcf.gz_url.json

e) Since there were multiple fileNames, take the dirname of the extracted URL (the 'result' value). 
The 'result' value in this example is ftp://ftp.sra.ebi.ac.uk/vol1/ERZ015/ERZ015356/ALL.chr5.integrated_phase1_v3.20101123.snps_indels_svs.genotypes.vcf.gz, so use URL 'ftp://ftp.sra.ebi.ac.uk/vol1/ERZ015/ERZ015356/'

In the case of a single fileName (as in ExAC), derive the URL needed from the URL retrieved for the single fileName as follows (due to a possible EVA bug):
If the URL begins with 'ftp://ftp.ebi.ac.uk/pub/databases/eva/', then insert 'eva_normalised_files/' between the URL of the directory that the URL points into (i.e. dirname) and the name of the file.
Otherwise simply use the URL as is.

(For the multiple filename case, taking the dirname above will give the user the choice between the 'submitted_files' subdirectory version and the 'eva_normalised_files' subdirectory version of the data files.


3: Where do I find the dataset attributes?

Accession number: Use the 'studyId'

URL: Use the URL extracted in steps 2d and 2e above.

Title: Use the 'name' from the summary returned in 2a.

Description: Use the 'description' from the summary returned in 2a. 

Technology: Use the 'platform' from the summary returned in 2a. 

Assay type: Use the 'experimentType' from the summary returned in 2a.


Note: The 'result' in the study summary is an array, suggesting that there might be support for multiple datasets within one study. The 'response' in the study files is also an array within which the 'result' is an array of files, so again might support a hierarchy but I have not noticed the means if any by which such hypothetical datasets would be linked between these two query responses.

Note2: EVA has its own FTP site in which the files for some of the studies are stored (e.g. ftp://ftp.ebi.ac.uk/pub/databases/eva/PRJEB8661/ in which the ExAC file is stored at ftp://ftp.ebi.ac.uk/pub/databases/eva/PRJEB8661/_dir_choice_/ExAC.r0.3.sites.vep.fixed.V3.vcf.gz, where _dir_choice_ can be 'submitted_files' or 'eva_normalised_files')  but the example above shows that there can also be links to other sites (e.g. the SRA FTP site - also within EBI).
