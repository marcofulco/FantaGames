<?php
require_once(__DIR__.'\dbConnect.php');
class leggiDati extends dbConnect{
    public function leggi($categoria)
    {
        global $error;
        try {
            $this->creaConnessione();
            $q="SELECT * FROM [$categoria]";
            $rs=$this->eseguiQuery($q);
            if($rs==false){
                throw new Exception("Dati non caricati!");
            }
            return $rs;
        } catch (Exception $e) {
            $error = $e->getMessage();
            return false;
        }
    }
}
