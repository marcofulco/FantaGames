<?php
require_once(__DIR__.'\dbConnect.php');
class caricaDati extends dbConnect{
    public function carica($dati, $categoria)
    {
        global $error;
        try {
            $this->creaConnessione();
            $this->iniziaTransazione();
            $colonne='';
            $q = "DROP TABLE [$categoria]";
            $rs = $this->eseguiQuery($q,false,'bool',true);
            // if ($rs == false) {
            //     throw new Exception("Errore cancellazione tabella");
            // }
        
        
            $q = "CREATE TABLE [$categoria] (
            Posizione INT NULL,
            Team NVARCHAR(MAX) NULL,
            [Totale Punti] INT NULL,
            [Score 1] NVARCHAR(50) NULL,
            [Posizione Prova 1] INT NULL,
            [Score 2] NVARCHAR(50) NULL,
            [Posizione Prova 2] INT NULL,
            [Score 3] NVARCHAR(50) NULL,
            [Posizione Prova 3] INT NULL,
            [Score 4] NVARCHAR(50) NULL,
            [Posizione Prova 4] INT NULL,
            [Score 5] NVARCHAR(50) NULL,
            [Posizione Prova 5] INT NULL,
            [Componenti] NVARCHAR(MAX) NULL,
            ) ";
            $rs = $this->eseguiQuery($q,false,'bool');
            if ($rs == false) {
                throw new Exception("Errore creazione tabella");
            }
            foreach ($dati as $key => $value) {
                foreach ($value as $k => $v) {
                    $colonne .= "[$k],";
                }
                break;
            }
            $colonne = substr($colonne, 0, -1);
            $valori = '';
            foreach ($dati as $key => $value) {
                $valori .= "(";
                foreach ($value as $k => $v) {
                    $valori .= "'$v',";
                }
                $valori = substr($valori, 0, -1);
                $valori .= "),";
            }
            $valori = substr($valori, 0, -1);
            $q = "INSERT INTO [$categoria] ($colonne) VALUES $valori";
            $rs = $this->eseguiQuery($q);
            if ($rs == false) {
                throw new Exception("Errore inserimento dati");
            }
            $res=$this->fineTransazione();
            if($res==false)
            {
                throw new Exception("Errore fine transazione");
            }
            return true;

        } catch (PDOException $e) {
            $this->logTxt('Errore inizio transazione', $e->getMessage());
            $error = $e->getMessage();
            $this->backTransazione();
            return false;
        }
    }
}
