<?php
require_once(__DIR__.'\dbConnect.php');
class leggiDati extends dbConnect{
    public function leggi($categoria,$classifica)
    {
        global $error;
        try {
            $this->creaConnessione();
            $select="concat('<div class=\"fw-bold\">',Team,'</div>','<div class=\"fs-6\">',Componenti,'</div>') as Team,";
            switch($classifica){
                case 'Overall':
                    $order="Posizione,[Totale Punti]";
                    break;
                case 'Wod1':
                    $order="[Posizione Prova 1],[Score 1]";
                    break;
                case 'Wod2':
                    $order="[Posizione Prova 2],[Score 2]";
                    break;
                case 'Wod3':
                    $order="[Posizione Prova 3],[Score 3]";
                    break;
                case 'Wod4':
                    $order="[Posizione Prova 4],[Score 4]";
                    break;
                case 'Wod5':
                    $order="[Posizione Prova 5],[Score 5]";
                    break;
                    default:
                throw new Exception("Classifica non valida!");

            }
            $select.=$order;
            $q="SELECT $select FROM [$categoria] order by $order";
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
